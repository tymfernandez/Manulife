import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";

// Import images directly
import carousel01 from "/Carousel01.png";
import carousel02 from "/Carousel02.png";
import carousel03 from "/Carousel03.png";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showMfaInput, setShowMfaInput] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [tempUserId, setTempUserId] = useState("");
  const { signIn, verifyMfaLogin } = useAuth();
  const navigate = useNavigate();

  // Carousel content
  const slides = [
    {
      image: carousel01,
      title: "Decisions made easier. Lives made better",
      description:
        "For your security — Sign in via your email password, your passcode, PIN, or Touch ID where available.",
    },
    {
      image: carousel03,
      title: "Secure your future today",
      description:
        "Advanced security measures to protect your financial information and personal data.",
    },
    {
      image: carousel02,
      title: "Your financial partner",
      description:
        "Comprehensive solutions tailored to your unique needs and goals.",
    },
  ];

  // Auto-scroll carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn(email, password);

    if (result.error) {
      setError(result.error.message);
    } else if (result.requiresMfa) {
      // Show MFA input
      setShowMfaInput(true);
      setTempUserId(result.tempUserId);
      setError("");
    } else {
      navigate("/dashboard");
    }
  };

  const handleMfaSubmit = async (e) => {
    e.preventDefault();
    const { error } = await verifyMfaLogin(tempUserId, mfaCode);
    if (error) {
      setError(error.message);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row p-4 sm:p-8 md:p-12 lg:p-20">
      {/* Left side - Form */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-4 sm:p-6 md:p-8 rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none shadow-2xl">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
              Welcome!
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Start your Life Champion journey</p>
          </div>

          {/* Sign up link */}
          <div className="text-center sm:text-right mb-4 sm:mb-6">
            <span className="text-xs sm:text-sm text-gray-600">Don't have account? </span>
            <Link
              to="/signup"
              className="text-xs sm:text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Signup
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-xs sm:text-sm mb-4 sm:mb-6">
              {error}
            </div>
          )}

          {showMfaInput ? (
            // MFA Verification Form
            <form onSubmit={handleMfaSubmit} className="space-y-4">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
                  Two-Factor Authentication
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>

              <div>
                <label
                  htmlFor="mfaCode"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
                >
                  Verification Code
                </label>
                <input
                  id="mfaCode"
                  type="text"
                  placeholder="123456"
                  value={mfaCode}
                  onChange={(e) =>
                    setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 text-center text-base sm:text-lg tracking-widest"
                  maxLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={mfaCode.length !== 6}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verify & Sign In
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMfaInput(false);
                  setMfaCode("");
                  setError("");
                }}
                className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm"
              >
                Back to Login
              </button>
            </form>
          ) : (
            // Regular Login Form
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                    required
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="password"
                    className="block text-xs sm:text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs sm:text-sm text-green-600 hover:text-green-700"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Keep me signed in */}
              <div className="flex items-center">
                <input
                  id="keepSignedIn"
                  type="checkbox"
                  checked={keepSignedIn}
                  onChange={(e) => setKeepSignedIn(e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="keepSignedIn"
                  className="ml-2 text-xs sm:text-sm text-gray-700"
                >
                  Keep me signed in
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Sign In
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Right side - Carousel */}
      <div className="flex-1 relative overflow-hidden rounded-b-2xl lg:rounded-r-2xl lg:rounded-bl-none shadow-2xl min-h-[300px] lg:min-h-full">
        {/* Manulife logo */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
          <div className="bg-green-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded text-xs sm:text-sm font-medium flex items-center">
            <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
            Royal Eagles
          </div>
        </div>

        {/* Carousel */}
        <div className="relative h-full bg-gray-200">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error("Image failed to load:", slide.image, e);
                  console.log("Attempted path:", e.target.src);
                }}
                onLoad={(e) => {
                  console.log("Image loaded successfully:", slide.image);
                  console.log("Actual path:", e.target.src);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>
          ))}

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-4">
                {slides[currentSlide].title}
              </h2>
              <p className="text-xs sm:text-sm opacity-90 leading-relaxed max-w-md">
                {slides[currentSlide].description}
              </p>
            </div>

            {/* Slide indicators */}
            <div className="flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-white"
                      : "bg-white bg-opacity-40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
