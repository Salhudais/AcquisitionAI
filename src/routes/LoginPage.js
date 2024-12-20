import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext'; // Context for authentication handling
import { ChevronDown, Eye, EyeOff, ArrowLeft, User } from 'lucide-react'; // Icons for UI
import { Link, useNavigate } from 'react-router-dom'; // React Router for navigation and links

/**
 * LoginPage Component
 * Handles user login functionality with:
 * - Email and password authentication.
 * - Two-factor authentication support.
 * - Form validation and alert handling.
 */
export default function LoginPage() {
  const { login, loading } = useContext(AuthContext); // Authentication context
  const [showPassword, setShowPassword] = useState(false); // Toggle for showing/hiding password
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  }); // Form data state
  const [alertMessage, setAlertMessage] = useState(''); // Alert message for errors or notifications
  const [checkedForTwoFactor, setCheckedForTwoFactor] = useState(false); // Indicates if two-factor authentication is checked
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false); // State for two-factor authentication status
  const navigate = useNavigate(); // React Router navigation hook

  /**
   * Handle input field changes.
   * Updates the form data state when fields change.
   * @param {Event} e - The input change event.
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAlertMessage(''); // Clear alert messages on new input
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  /**
   * Handle form submission for login.
   * Sends login credentials to the server and checks for two-factor authentication.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      email: formData.email,
      password: formData.password,
    };

    try {
      // API call for user login
      const loginResponse = await fetch('https://api.onboardingai.org/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.message || 'Network response was not ok');
      }

      // Check for two-factor authentication
      const twoFactorResponse = await fetch('https://api.onboardingai.org/auth/has-two-factor', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const twoFactorData = await twoFactorResponse.json();

      if (twoFactorData.success && twoFactorData.twoFactorAuthEnabled) {
        setIsTwoFactorEnabled(true); // Enable two-factor authentication
      }

      setCheckedForTwoFactor(true); // Mark two-factor check as complete
    } catch (err) {
      console.error('Login error:', err);
      setAlertMessage(`Failed: ${err.message}`); // Display error message
    }
  };

  /**
   * Effect to handle post-login navigation based on authentication state.
   * Redirects to the dashboard or two-factor authentication page as necessary.
   */
  useEffect(() => {
    const handleLogin = async () => {
      if (checkedForTwoFactor) {
        if (isTwoFactorEnabled) {
          navigate(`/two-factor?email=${btoa(formData.email)}`); // Redirect to two-factor authentication
        } else {
          await login(); // Perform login
          if (!loading) {
            navigate('/dashboard'); // Redirect to dashboard
          }
        }
      }
    };

    handleLogin();
  }, [checkedForTwoFactor, navigate, isTwoFactorEnabled, formData.email, login, loading]);

  return (
    <div className="min-h-screen bg-[#E6E6FA] flex flex-col">
      {/* Top Bar */}
      <div className="bg-white p-4 flex justify-between items-center">
        <Link to="/" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <nav className="hidden md:flex space-x-6">
          <NavItem text="Product" />
          <NavItem text="Resource" />
          <NavItem text="Tool" />
        </nav>
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <User className="h-6 w-6 text-gray-600" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl p-8 w-full shadow-lg">
            <div className="text-3xl font-bold mb-8 text-center">
              <div className="inline-block border-2 border-black rounded-xl px-4 py-2">
                <span className="text-[#4285F4]">Onboard</span>
                <span className="text-black">AI</span>
              </div>
            </div>

            {/* Alert message for errors */}
            {alertMessage && (
              <div className="mb-4 p-4 rounded-lg text-white bg-red-500">
                {alertMessage}
              </div>
            )}

            <h1 className="text-3xl font-bold mb-6 text-center">Log in</h1>
            <form onSubmit={handleSubmit}>
              {/* Email input */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Password input */}
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
              </div>

              {/* Remember Me checkbox */}
              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-[#4285F4] focus:ring-[#4285F4] border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              {/* Terms and Privacy */}
              <p className="text-sm text-gray-600 mb-6">
                By continuing, you agree to the{' '}
                <Link to="/terms" className="text-[#4285F4] hover:underline">
                  Terms of use
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-[#4285F4] hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-full font-medium hover:bg-gray-400 transition-colors"
              >
                Log in
              </button>
            </form>

            {/* Forgot password link */}
            <div className="mt-6 text-center">
              <Link to="/forgot-password" className="text-sm text-[#4285F4] hover:underline">
                Forgot your password
              </Link>
            </div>

            {/* Signup link */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-[#4285F4] hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-6 px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center">
          <div className="w-full sm:w-auto flex justify-center sm:justify-start items-center space-x-4 mb-4 sm:mb-0">
            <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
          </div>
          <div className="w-full sm:w-auto text-center sm:text-left text-gray-600 text-sm">
            © 2024 OnboardAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * NavItem Component
 * Displays a navigation item with a dropdown chevron.
 */
function NavItem({ text }) {
  return (
    <div className="relative group">
      <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900">
        <span>{text}</span>
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  );
}
