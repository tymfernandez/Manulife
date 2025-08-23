import { useState, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/authContext'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [personalCode, setPersonalCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  // Carousel content
  const slides = [
    {
      image: "/Carousel01.JPG",
      title: "Join the Manulife Family",
      description: "Create your account to access exclusive Manulife services and benefits."
    },
    {
      image: "/Carousel03.JPG",
      title: "Secure Registration",
      description: "Your information is protected with enterprise-grade security measures."
    },
    {
      image: "/Carousel02.JPG",
      title: "Get Started Today",
      description: "Begin your journey with Manulife's comprehensive financial solutions."
    }
  ]

  // Auto-scroll carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    const { error, message } = await signUp(email, password, { personalCode })
    if (error) {
      setError(error.message)
    } else {
      setMessage(message || 'Check your email for confirmation link')
      setTimeout(() => navigate('/signin'), 2000)
    }
  }

  return (
    <div className="min-h-screen flex p-20">
      {/* Left side - Form */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-8 rounded-l-2xl shadow-2xl">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Create Account
            </h1>
            <p className="text-gray-600">Join the Manulife team</p>
          </div>

          {/* Sign in link */}
          <div className="text-right mb-6">
            <span className="text-sm text-gray-600">Already have account? </span>
            <Link
              to="/signin"
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Sign In
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm mb-6">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
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

            {/* Personal Code field */}
            <div>
              <label
                htmlFor="personalCode"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Personal Code
              </label>
              <input
                id="personalCode"
                type="text"
                placeholder="Enter your personal code"
                value={personalCode}
                onChange={(e) => setPersonalCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                required
              />
            </div>

            {/* Password field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
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

            {/* Confirm Password field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>

      {/* Right side - Carousel */}
      <div className="flex-1 relative overflow-hidden rounded-r-2xl shadow-2xl">
        {/* Manulife logo */}
        <div className="absolute top-6 right-6 z-10">
          <div className="bg-green-600 text-white px-3 py-1 rounded text-sm font-medium flex items-center">
            <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
            Manulife
          </div>
        </div>

        {/* Carousel */}
        <div className="relative h-full">
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
                  console.error("Image failed to load:", slide.image)
                  e.target.style.display = "none"
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>
          ))}

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">
                {slides[currentSlide].title}
              </h2>
              <p className="text-sm opacity-90 leading-relaxed max-w-md">
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
  )
}
