import React from "react";
import { Link } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RoyalEaglesTemplate = () => {
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      title: "INVESTMENT",
      description:
        "Build your wealth through strategic investment opportunities and financial planning solutions.",
      image: "/Investment.png",
    },
    {
      id: 2,
      title: "SAVINGS",
      description:
        "Secure your future with our comprehensive savings plans and retirement solutions.",
      image: "/Savings.png",
    },
    {
      id: 3,
      title: "EDUCATION",
      description:
        "Invest in education and skill development for long-term career advancement.",
      image: "/Education.png",
    },
    {
      id: 4,
      title: "HEALTH",
      description:
        "Comprehensive health insurance and wellness programs for you and your family.",
      image: "/Health.png",
    },
    {
      id: 5,
      title: "RETIREMENT",
      description:
        "Plan for a comfortable retirement with our tailored retirement solutions.",
      image: "/Retirement.png",
    },
    {
      id: 6,
      title: "PROTECTION",
      description:
        "Protect your assets and loved ones with our comprehensive insurance coverage.",
      image: "/Protection.png",
    },
    {
      id: 7,
      title: "GROUP PRODUCTS",
      description:
        "Specialized group insurance and benefits for organizations and businesses.",
      image: "/GroupProducts.png",
    },
    {
      id: 8,
      title: "UITF",
      description:
        "Avail of pure investments with access to global markets and regular cash payouts.",
      image: "/Investment.png",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/Dark-Logo-Name.png" width={120} height={100} alt="Logo" />
          </div>
          <button
            className="bg-emerald-800 hover:bg-orange-500 text-white px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-2 rounded-lg font-medium text-sm sm:text-md transition-colors duration-200 shadow-md hover:shadow-lg"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-100 via-white to-orange-50 py-6 sm:py-8 md:py-10">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-15">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
              <div className="space-y-4 sm:space-y-6">
                <div className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-green-200 text-green-700 rounded-full text-xs sm:text-sm font-medium">
                  <div className="w-2 h-2 bg-green-700 rounded-full mr-2 animate-pulse"></div>
                  Now Recruiting Life Champions
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Build Your
                  <span className="text-orange-500 block">Legacy</span>
                  <span>With Us</span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                     Join the Royal Eagles Region and become part of a winning team
                  that transform lives through financial security and peace of mind. 
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6 md:space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">
                    300+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Active Agents
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">
                    ₱500M+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Assets Under Management
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">
                    17+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Years of Excellence
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0">
              <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 relative z-10">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                  <img
                    src="/Dark-Logo.png"
                    alt="Team Success"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-green-100"
                  />
                  <div className="text-center sm:text-left">
                    <h3 className="font-bold text-base sm:text-lg text-gray-900">
                      Join Our Success Story
                    </h3>
                    <p className="text-green-600 font-medium text-sm sm:text-base">
                      Life Champions Community
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed text-sm sm:text-base text-center sm:text-left">
                  Be part of a global winning team that offers purposeful life,
                  personal growth, and career advancement in the financial
                  services industry.
                </p>


              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-24 sm:h-24 bg-green-200 rounded-full opacity-20"></div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 sm:w-32 sm:h-32 bg-green-100 rounded-full opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-800 py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-500 mb-4">
              Ready to Become a Life Champion?
            </h2>
            <p className="text-green-100 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed px-4">
              Join thousands of successful Financial Advisors who have built
              thriving careers with us. Your journey to financial independence
              starts here.
            </p>
            <button
              className="bg-white text-orange-500 hover:bg-gray-50 px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-4 rounded-lg font-bold text-base sm:text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto"
              onClick={() => navigate("/application-form")}
            >
              Apply Now - It's Free!
            </button>
            <p className="text-green-200 text-xs sm:text-sm mt-4 px-4">
              ✓ No experience required ✓ Comprehensive training provided ✓
              Unlimited earning potential
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="bg-white py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-orange-500 text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12">
            OUR PRODUCTS
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-emerald-800 rounded-lg overflow-hidden shadow-lg"
              >
                <div className="h-48 bg-gray-300 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-3 text-center text-white">
                    {product.title}
                  </h3>
                  <p className="text-white text-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 Royal Eagles Region. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RoyalEaglesTemplate;
