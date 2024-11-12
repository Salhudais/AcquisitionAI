const twilio = require('twilio');
const { generateTTS, processTranscript } = require('./deepgramService.js');
const { v4: uuidv4 } = require('uuid');
const { createClient, LiveTranscriptionEvents } = require('@deepgram/sdk');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const client = new MongoClient(process.env.DB_URI, {
  tls: true,
  tlsAllowInvalidCertificates: true,
});

/*
const callLeads = async (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ success: false, message: 'Name and number are required' });
  }

  try {
    const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    
    console.log('Initiating call to:', req.body.to);

    const call = await client.calls.create({
      // Update these URLs to include the /call-leads prefix
      url: 'https://api.onboardingai.org/call-leads/twilio-stream',
      to: req.body.to,
      from: req.body.from,
      statusCallback: 'https://api.onboardingai.org/call-leads/call-status',
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      statusCallbackMethod: 'POST'
    });

    console.log('Call initiated with SID:', call.sid);
    res.json({ success: true, callSid: call.sid });

  } catch (error) {
    console.error('Error initiating call:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
*/

// Function to make a call using Twilio
/*
const makeCall = async (to) => {
  try {
    const call = await twilioClient.calls.create({
      url: `https://api.onboardingai.org/twilio-stream?phoneNumber=${to}`,
      to: to,
      from: TWILIO_PHONE_NUMBER,
    });
    console.log(`Call initiated, SID: ${call.sid}, to: ${to}`);
  } catch (error) {
    console.error(`Error initiating call to ${to}:`, error);
  }
};
*/

// Twilio Stream Webhook
const twilioStreamWebhook = (req, res) => {
  const phoneNumber = req.query.phoneNumber;
  
  const response = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Connect>
        <Stream url="wss://api.onboardingai.org/call-leads/media">
          <Parameter name="phoneNumber" value="${phoneNumber}" />
        </Stream>
      </Connect>
      <Dial>${phoneNumber}</Dial>
    </Response>
  `;
  res.type('text/xml');
  res.send(response);
};

// WebSocket handling for incoming audio from Twilio
const handleWebSocket = (ws, req) => {
  let streamSid;
  let callSid;
  let dgLive;
  let audioBufferQueue = [];
  let phoneNumber;
  let interactionCount = 0;
  let callerName = '';

  console.log('WebSocket connection established', {
    phoneNumber,
    query: req.query,
    headers: req.headers
  });
  // Add heartbeat to prevent timeout
  const pingInterval = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      ws.ping();
    }
  }, 30000);

  ws.on('pong', () => {
    console.log('Received pong from client');
  });

  // Function to send audio frames to Twilio
  const sendAudioFrames = async (audioBuffer, ws, streamSid, index) => {
    if (index === interactionCount && ws.readyState === ws.OPEN) {
      await sendBufferedAudio(audioBuffer, ws, streamSid);
      interactionCount++;
    }
  };

  const sendBufferedAudio = async (audioBuffer, ws, streamSid) => {
    const frameSize = 160;
    const frameDurationMs = 20;

    for (let i = 0; i < audioBuffer.length; i += frameSize) {
      if (ws.readyState !== ws.OPEN) {
        console.log('WebSocket is not open. Stopping audio frame transmission.');
        break;
      }

      const frame = audioBuffer.slice(i, i + frameSize);
      const frameBase64 = frame.toString('base64');

      ws.send(
        JSON.stringify({
          event: 'media',
          streamSid: streamSid,
          media: {
            payload: frameBase64,
          },
        }),
        (error) => {
          if (error) {
            console.error('Error sending TTS audio frame to Twilio:', error);
          }
        }
      );

      await new Promise((resolve) => setTimeout(resolve, frameDurationMs));
    }

    if (ws.readyState === ws.OPEN) {
      const markLabel = uuidv4();
      ws.send(
        JSON.stringify({
          event: 'mark',
          streamSid: streamSid,
          mark: {
            name: markLabel,
          },
        })
      );
    }
  };

  ws.on('message', async (message) => {
    const data = JSON.parse(message);
    if (data.event === 'start') {
      console.log('Start event data:', JSON.stringify(data, null, 2));
      streamSid = data.start.streamSid;
      callSid = data.start.callSid;

      if (data.start.customParameters && data.start.customParameters.phoneNumber) {
        phoneNumber = data.start.customParameters.phoneNumber;
      }

      console.log(`Stream started: ${streamSid} for phone number: ${phoneNumber}`);

      dgLive = deepgram.listen.live({
        encoding: 'mulaw',
        sample_rate: 8000,
        channels: 1,
        model: 'nova',
        punctuate: true,
        interim_results: true,
        endpointing: 200,
        utterance_end_ms: 1000,
      });

      dgLive.on(LiveTranscriptionEvents.Open, async () => {
        console.log('Deepgram Live Transcription connection opened.');

        const initialMessage = 'Hello! May I know your name, please?';
        console.log('Sending initial message to user:', initialMessage);

        const ttsAudioBuffer = await generateTTS(initialMessage);
        await sendAudioFrames(ttsAudioBuffer, ws, streamSid, interactionCount);
      });

      dgLive.on(LiveTranscriptionEvents.Transcript, async (transcription) => {
        if (transcription.is_final) {
          const alternatives = transcription.channel.alternatives[0];
          const transcript = alternatives.transcript;

          if (transcript.trim()) {
            console.log('Final Transcription:', transcript);

            if (!callerName) {
              const extractedName = await processTranscript(transcript, true);
              if (extractedName) {
                callerName = extractedName;
                console.log(`Caller name captured: ${callerName}`);

                const leadInfo = {
                  number: phoneNumber,
                  name: callerName,
                };
                await updateLeadInfo(phoneNumber, leadInfo);

                const responseMessage = `Nice to meet you, ${callerName}. How can I assist you today?`;
                const ttsAudioBuffer = await generateTTS(responseMessage);
                await sendAudioFrames(ttsAudioBuffer, ws, streamSid, interactionCount);
                return;
              }
            }

            const assistantResponse = await processTranscript(transcript);
            const ttsAudioBuffer = await generateTTS(assistantResponse);
            await sendAudioFrames(ttsAudioBuffer, ws, streamSid, interactionCount);

            console.log('Assistant response sent to Twilio.');
          } else {
            console.log('Received empty final transcription, skipping.');
          }
        }
      });

      dgLive.on(LiveTranscriptionEvents.Error, (error) => {
        console.error('Deepgram error:', error);
      });

      dgLive.on(LiveTranscriptionEvents.Close, () => {
        console.log('Deepgram Live Transcription connection closed.');
      });

    } else if (data.event === 'media') {
      const audioBufferData = Buffer.from(data.media.payload, 'base64');

      if (dgLive && dgLive.getReadyState() === 1) {
        dgLive.send(audioBufferData);
      } else {
        audioBufferQueue.push(audioBufferData);
      }
    } else if (data.event === 'stop') {
      console.log('Stream stopped.');
      if (dgLive) {
        dgLive.finish();
      }
      ws.close();
    }
  });

  ws.on('stop', () => {
    console.log('Stream stopped.');
    if (dgLive) {
      dgLive.finish();
    }
    if (ws.readyState === ws.OPEN) {
      ws.close();
    }
  });

  ws.on('close', () => {
    clearInterval(pingInterval);
    console.log('WebSocket connection closed');
    if (dgLive) {
      dgLive.finish();
    }
    audioBufferQueue.length = 0;
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
};

module.exports = {
  twilioStreamWebhook,
  handleWebSocket
};