import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // For navigation links
import Logo from './Logo'; // Logo component for branding
import DropdownMenu from './DropdownMenu'; // Dropdown menu component for Products and Resources
import { Menu, X, LayoutDashboard,  PhoneCall, FileText, DollarSign, Star, Mail, HelpCircle } from 'lucide-react'; // Icons for menu items

/**
 * Header Component
 * A responsive header with navigation links, dropdown menus, and authentication buttons.
 * Includes:
 * - A logo.
 * - Dropdown menus for Products and Resources.
 * - Sign-up and Log-in buttons.
 * - Mobile menu toggle for smaller screens.
 */
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to track mobile menu visibility

  /**
   * Toggles the mobile menu visibility.
   */
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Menu items for the "Products" dropdown
  const productItems = [
    {
      title: "Dashboard",
      description: "Get a bird's-eye view of your business",
      icon: <LayoutDashboard className="h-6 w-6" />,
      linkTo: "/product"
    },
    {
      title: "AI Calling",
      description: "Automate your calls with AI",
      icon: <PhoneCall className="h-6 w-6" />,
      linkTo: "/product"
    },
    {
      title: "Custom Scripts",
      description: "Customize your AI calling scripts",
      icon: <FileText className="h-6 w-6" />,
      linkTo: "/product"
    },
    {
      title: "Pricing",
      description: "Find the right plan for your needs",
      icon: <DollarSign className="h-6 w-6" />,
      linkTo: "/pricing"
    },
  ];

  // Menu items for the "Resources" dropdown
  const resourceItems = [
    {
      title: "About Us",
      description: "Learn more about our company",
      icon: <FileText className="h-6 w-6" />,
      linkTo: "/about"
    },
    {
      title: "Reviews",
      description: "See what our customers are saying",
      icon: <Star className="h-6 w-6" />,
      linkTo: "/reviews"
    },
    {
      title: "Contact Us",
      description: "Get in touch with our team",
      icon: <Mail className="h-6 w-6" />,
      linkTo: "/contact"
    },
    {
      title: "FAQ",
      description: "Find answers to common questions",
      icon: <HelpCircle className="h-6 w-6" />,
      linkTo: "/faq"
    },
  ];

  return (
    <header className="relative flex items-center justify-between lg:justify-start py-6 px-8 w-full bg-white shadow-sm z-40">
      {/* Left section: Logo and mobile menu button */}
      <div className="flex items-center justify-between w-full lg:w-auto">
        <Logo /> {/* Logo component */}
        <button 
          className="lg:hidden" // Visible only on mobile screens
          onClick={toggleMenu} // Toggle mobile menu
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />} {/* Menu icon changes based on state */}
        </button>
      </div>

      {/* Navigation menu */}
      <nav className={`lg:flex ${isMenuOpen ? 'flex' : 'hidden'} flex-col lg:flex-row absolute lg:static top-full left-0 w-full lg:w-auto lg:ml-auto bg-white lg:bg-transparent z-50`}>
        {/* Dropdown menus */}
        <div className="lg:flex lg:flex-1 lg:justify-center lg:mr-32">
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8 p-4 lg:p-0">
            <DropdownMenu title="Products" platformItems={productItems} /> {/* Products dropdown */}
            <DropdownMenu title="Resources" platformItems={resourceItems} /> {/* Resources dropdown */}
          </div>
        </div>

        {/* Divider for desktop view */}
        <div className="hidden lg:block lg:w-px lg:h-6 lg:bg-gray-200 lg:mx-20"></div>

        {/* Authentication buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4 p-4 lg:p-0">
          {/* Sign-up button */}
          <Link to='/sign-up'>
            <button className="w-full lg:w-auto px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50">
              Sign Up
            </button>
          </Link>
          {/* Log-in button */}
          <Link to='/login'>
            <button className="w-full lg:w-auto px-6 py-2 text-sm font-medium text-white bg-[#5468FF] rounded-full hover:bg-[#4054FF]">
              Log in
            </button>
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;
