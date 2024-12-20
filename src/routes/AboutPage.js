import React from 'react';
import { ChevronDown } from 'lucide-react'; // Icon for dropdowns
import { useEffect } from 'react';

// Importing custom button component for About Page
import { ButtonAboutPage } from "../components/ui/buttonAboutPage.js";

/**
 * AboutPageHeader component
 * Renders the "About Us" page header, with mission, story, and feature highlights.
 * Includes functionality to scroll to the top when mounted.
 */
export default function AboutPageHeader() {

  // Scroll to the top of the page when the component is mounted
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Section */}
      <header className="relative bg-white shadow">
        {/* Add any additional header content or navigation */}
      </header>

      {/* Main Content Section */}
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* About Us Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-black mb-12">
            <div className="p-8">
              <h1 className="text-4xl font-bold text-[#6366F1] mb-8 text-center">
                About us
              </h1>
              {/* Flex container for image and description */}
              <div className="flex flex-col md:flex-row items-center justify-between">
                {/* Left: Image */}
                <div className="md:w-1/2 mb-8 md:mb-0">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/customer-acquisition-image-6A0jTBiwFMHeGVGscXy2iiNC7kyOa9.jpg"
                    alt="Customer Acquisition Illustration"
                    className="rounded-lg w-full h-auto"
                  />
                </div>
                {/* Right: Description */}
                <div className="md:w-1/2 md:pl-12">
                  <h2 className="text-3xl font-bold mb-4">
                    Revolutionizing Customer Onboarding for Small Businesses
                  </h2>
                  <p className="text-gray-600">
                    At OnboardingAI, we aim to simplify and enhance the customer onboarding experience for small businesses...
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional sections like "Our Story" and "Our Mission" go here */}
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-[rgba(75,52,217,0.2)] py-16 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Newsletter subscription form */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-6 text-[#2D3748]">
              Stay Updated
            </h3>
            <form className="flex mb-4">
              <input
                type="email"
                placeholder="Your Email"
                className="flex-grow px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-[#5468FF]"
              />
              <button
                type="submit"
                className="px-6 py-2 text-white bg-[#5468FF] rounded-r-full hover:bg-[#4054FF] focus:outline-none focus:ring-2 focus:ring-[#5468FF]"
              >
                Subscribe
              </button>
            </form>
            <p className="text-sm text-gray-600">
              Subscribe and get the latest information from OnboardAI.
            </p>
          </div>
          {/* Support links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-[#2D3748]">
              Support
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Account Information</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">FAQ</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Contact Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Help Center</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
