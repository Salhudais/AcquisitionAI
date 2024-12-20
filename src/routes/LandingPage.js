import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext'; // Context for authentication status
import Header from '../components/Header'; // Navigation header component
import HeroSection from '../components/HeroSection'; // Hero section with main landing content
import FeaturesSection from '../components/FeaturesSection'; // Features overview section
import FiveStarReviewCarousel from '../components/FiveStarReviewCarousel'; // Carousel for 5-star reviews
import CTASection from '../components/CTASection'; // Call-to-action section
import Footer from '../components/Footer'; // Footer component

/**
 * LandingPage Component
 * The main landing page of the application, displaying key features and call-to-action sections.
 * Redirects authenticated users to the dashboard and shows the landing page to unauthenticated users.
 */
export default function LandingPage() {
  // Destructure authentication state and loading status from AuthContext
  const { isAuthenticated, loading } = useContext(AuthContext);

  // React Router's navigation function
  const navigate = useNavigate();

  // Local loading state to handle initial redirection or content display
  const [localLoading, setLocalLoading] = useState(true);

  /**
   * useEffect: Redirect authenticated users to the dashboard.
   * If not authenticated, set localLoading to false to show the landing page content.
   */
  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        navigate('/dashboard'); // Redirect authenticated users
      } else {
        setLocalLoading(false); // Show landing page for unauthenticated users
      }
    }
  }, [isAuthenticated, loading, navigate]);

  /**
   * Display a blank loading screen if authentication status or loading state is in progress.
   */
  if (localLoading || loading) {
    return <div className="min-h-screen bg-white"></div>;
  }

  /**
   * Main landing page content for unauthenticated users.
   */
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* Header component with navigation */}
      <Header />

      {/* Main content area */}
      <main className="flex-grow">
        {/* Hero section with a welcoming message and key highlights */}
        <HeroSection />
        {/* Features section outlining the product's value propositions */}
        <FeaturesSection />
        {/* Carousel showcasing 5-star reviews from customers */}
        <FiveStarReviewCarousel />
        {/* Call-to-action section to encourage user engagement */}
        <CTASection />
      </main>

      {/* Footer component */}
      <Footer />
    </div>
  );
}
