import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react'; // Icon for dropdown toggle
import { Link } from 'react-router-dom'; // React Router for navigation links

/**
 * DropdownMenu Component
 * A dropdown menu component that displays a list of items with optional icons and descriptions.
 * Includes:
 * - Toggle functionality for showing/hiding the dropdown.
 * - Click detection outside the menu to close it.
 * - Dynamic rendering of menu items and an optional image on the left.
 * 
 * @param {string} title - The title of the dropdown button.
 * @param {Array} platformItems - An array of menu items, each containing a `title`, `description`, `icon`, and `linkTo`.
 */
const DropdownMenu = ({ title = 'Menu', platformItems }) => {
  const [isOpen, setIsOpen] = useState(false); // State to control dropdown visibility
  const dropdownRef = useRef(null); // Ref to track the dropdown container

  /**
   * useEffect to handle clicks outside the dropdown menu.
   * Closes the menu if the user clicks outside the dropdown container.
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false); // Close the dropdown
      }
    };

    // Add event listener for mouse clicks
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Cleanup the event listener on component unmount
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /**
   * Get the appropriate image source based on the dropdown title.
   * @returns {string} - The image source URL.
   */
  const getImageSrc = () => {
    return title.toLowerCase() === 'products' 
      ? '/images/product.png' 
      : '/images/resources.png';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown button */}
      <button
        onClick={() => setIsOpen(!isOpen)} // Toggle dropdown visibility
        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
        id={`${title ? title.toLowerCase() : 'menu'}-menu-button`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {title}
        <ChevronDown className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" /> {/* Dropdown icon */}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="fixed inset-x-0 top-36 z-50 flex justify-center px-6 sm:px-8 md:px-10">
          <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
            <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left column with an image (visible only on large screens) */}
                <div className="hidden lg:block">
                  <div className="relative h-full w-full rounded-lg overflow-hidden">
                    <img
                      src={getImageSrc()} // Dynamically load the image based on the title
                      alt={`${title} illustration`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                
                {/* Right columns with menu items */}
                <div className="lg:col-span-2 grid gap-4 grid-cols-2">
                  {platformItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.linkTo} // Navigation link for the menu item
                      className="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50 transition ease-in-out duration-150 w-full no-underline"
                      onClick={() => setIsOpen(false)} // Close dropdown on item click
                    >
                      {/* Icon or visual indicator */}
                      <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-indigo-500 text-white sm:h-12 sm:w-12">
                        {item.icon} {/* Render the provided icon */}
                      </div>
                      {/* Menu item details */}
                      <div className="ml-4">
                        <p className="text-base font-medium text-gray-900">{item.title}</p>
                        <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
