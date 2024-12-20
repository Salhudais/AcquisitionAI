import React, { useState } from 'react';
import Header from './Header'; // Import the Header component for page navigation
import { Send } from 'lucide-react'; // Import the Send icon for the submit button

/**
 * ContactUsPage Component
 * A simple contact form for users to send messages. It includes:
 * - Input fields for full name, email, and message.
 * - Form validation to ensure all fields are filled.
 * - Handles form submission and resets form after submission.
 */
const ContactUsPage = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: ''
  });

  /**
   * Handle input field changes
   * Updates the form data state when the user types in the input fields.
   * @param {Event} e - The input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value // Update the corresponding field in the state
    }));
  };

  /**
   * Handle form submission
   * Prevents the default form submission behavior, logs the form data, and clears the form.
   * @param {Event} e - The form submission event
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log('Form submitted:', formData); // Log the form data to the console
    setFormData({ fullName: '', email: '', message: '' }); // Reset the form fields
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'rgba(75, 52, 217, 0.2)' }} // Light purple background
    >
      <Header /> {/* Header component for navigation */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 lg:p-12">
            
            {/* Left section: Information and image */}
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                Let's Start a <span className="text-purple-600">Conversation</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 mb-8">
                We're here to help and answer any question you might have. We look forward to hearing from you!
              </p>
              <div className="bg-purple-100 rounded-2xl p-6">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/contact%20us%20picture-eA7wQm7dICfrVCZfyDYlanRg6ywzl6.webp"
                  alt="Customer support representative"
                  className="w-full h-64 object-cover rounded-xl"
                />
              </div>
            </div>

            {/* Right section: Contact form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Get in Touch</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Full Name input */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email input */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Message textarea */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                {/* Submit button */}
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out"
                  >
                    <Send className="w-5 h-5 mr-2" /> {/* Send icon */}
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactUsPage;
