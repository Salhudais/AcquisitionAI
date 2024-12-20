import React, { useState } from 'react';
import Header from './Header'; // Header component for navigation
import { Plus, Minus } from 'lucide-react'; // Icons for expanding/collapsing FAQ items

/**
 * FAQItem Component
 * Represents an individual FAQ item with a toggleable answer.
 * @param {string} number - The question number displayed.
 * @param {string} question - The FAQ question.
 * @param {string} answer - The FAQ answer.
 * @param {boolean} isOpen - Whether the answer is currently visible.
 * @param {function} toggleOpen - Function to toggle the visibility of the answer.
 */
const FAQItem = ({ number, question, answer, isOpen, toggleOpen }) => {
  return (
    <div
      className={`mb-4 rounded-lg overflow-hidden transition-all duration-300 ${
        isOpen ? 'bg-purple-100' : 'bg-purple-50 hover:bg-purple-100'
      }`}
    >
      {/* FAQ question button */}
      <button
        className="flex justify-between items-center w-full py-5 px-6 text-left"
        onClick={toggleOpen} // Toggle visibility of the answer
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
          {/* Question number */}
          <span className="text-3xl font-light text-purple-400 mr-4">
            {number.padStart(2, '0')} {/* Pad single digits with a leading zero */}
          </span>
          {/* Question text */}
          <h3 className="text-lg font-medium text-gray-900">{question}</h3>
        </div>
        {/* Toggle icon: Plus when closed, Minus when open */}
        {isOpen ? (
          <Minus className="flex-shrink-0 ml-2 text-purple-500" />
        ) : (
          <Plus className="flex-shrink-0 ml-2 text-purple-500" />
        )}
      </button>
      {/* FAQ answer section (visible only when isOpen is true) */}
      {isOpen && (
        <div className="px-6 pb-5">
          <p className="text-gray-600">{answer}</p>
        </div>
      )}
    </div>
  );
};

/**
 * FAQPage Component
 * Displays a list of frequently asked questions with expandable answers.
 * Includes:
 * - Header for navigation.
 * - List of FAQs with expandable items.
 */
const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null); // State to track the currently open FAQ

  // List of FAQs
  const faqs = [
    {
      question: "How does OnboardAI improve the onboarding process for new employees or clients?",
      answer: "OnboardAI streamlines onboarding by automating workflows, providing tailored resources, and offering personalized guidance, which reduces manual tasks and accelerates the adaptation process for new users."
    },
    {
      question: "What kind of data security measures does OnboardAI implement?",
      answer: "OnboardAI prioritizes data security by implementing industry-standard encryption, secure user authentication, and regular compliance checks to protect sensitive information throughout the onboarding process."
    },
    {
      question: "Is OnboardAI customizable for different types of businesses or industries?",
      answer: "Yes, OnboardAI is highly customizable. It allows businesses to tailor onboarding flows, content, and resources to align with their unique brand, industry standards, and compliance requirements."
    },
    {
      question: "How easy is it to integrate OnboardAI with existing systems and software?",
      answer: "OnboardAI offers seamless integrations with various platforms through APIs and pre-built connectors, making it easy to connect with your current CRM, HR, and project management tools without extensive development work."
    }
  ];

  /**
   * Toggle the open state of a specific FAQ.
   * @param {number} index - The index of the FAQ to toggle.
   */
  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index); // Close if already open, otherwise open
  };

  return (
    <div className="min-h-screen bg-[#E6E6FA]">
      <Header /> {/* Header for navigation */}
      <main className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Page title */}
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Frequently Asked Questions
        </h1>
        {/* List of FAQ items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              number={`${index + 1}`} // Question number (1-based index)
              question={faq.question}
              answer={faq.answer}
              isOpen={index === openIndex} // Determine if the current item is open
              toggleOpen={() => toggleQuestion(index)} // Function to toggle the item
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default FAQPage;
