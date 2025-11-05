import { useState } from "react";
import { Link } from "react-router-dom";
import { passwordService } from "../../services/passwordService";

// Import images directly
import carousel01 from "/Carousel01.png";
import carousel02 from "/Carousel02.png";
import carousel03 from "/Carousel03.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Carousel content (same as SignIn)
  const slides = [
    {
      image: carousel01,
      title: "Decisions made easier. Lives made better",
      description: "Reset your password securely to continue your Life Champion journey.",
    },
    {
      image: carousel03,
      title: "Secure password recovery",
      description: "We'll send you a secure link to reset your password safely.",
    },
    {
      image: carousel02,
      title: "Your financial partner",
      description: "Get back to managing your comprehensive financial solutions.",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const result = await passwordService.sendPasswordResetEmail(email);
    
    if (result.success) {
      setSuccess("Password reset email sent! Please check your inbox and follow the instructions.");
    } else {
      setError(result.error || "Failed to send reset email. Please try again.");
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row p-4 sm:p-8 md:p-12 lg:p-20">
      {/* Left side - Form */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-4 sm:p-6 md:p-8 rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none shadow-2xl">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
              Forgot Password?
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Enter your email to receive a password reset link
            </p>
          </div>

          {/* Back to sign in link */}
          <div className="text-center sm:text-right mb-4 sm:mb-6">
            <span className="text-xs sm:text-sm text-gray-600">Remember your password? </span>
            <Link
              to="/signin"
              className="text-xs sm:text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Sign In
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-xs sm:text-sm mb-4 sm:mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-700 p-3 rounded-lg text-xs sm:text-sm mb-4 sm:mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
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
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {/* Additional help */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              Didn't receive the email? Check your spam folder or{" "}
              <button
                onClick={handleSubmit}
                disabled={loading || !email}
                className="text-green-600 hover:text-green-700 underline disabled:opacity-50"
              >
                try again
              </button>
            </p>
          </div>
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

        {/* Static carousel content */}
        <div className="relative h-full bg-gray-200">
          <div className="absolute inset-0">
            <img
              src={carousel02}
              alt="Password Recovery"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-4">
                Secure Password Recovery
              </h2>
              <p className="text-xs sm:text-sm opacity-90 leading-relaxed max-w-md">
                We'll send you a secure link to reset your password and get you back to your Life Champion journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}