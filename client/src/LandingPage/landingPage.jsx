import React from "react";
import { Phone, Instagram, Mail, Link } from "lucide-react";
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
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="py-1 mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center ">
              <img src="/RoyalEaglesLogo.png" width={150} height={130} />
            </div>
            <button
              className="bg-emerald-800 hover:bg-orange-500 text-white px-6 py-2 rounded-lg font-medium text-md transition-colors duration-200 shadow-md hover:shadow-lg"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-100 via-white to-orange-50 py-10">
        <div className="container mx-auto px-15">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-green-200 text-green-700 rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-green-700 rounded-full mr-2 animate-pulse"></div>
                  Now Recruiting Life Champions
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Build Your
                  <span className="text-orange-500 block">Legacy</span>
                  <span>With Us</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Join the Royal Eagles Region and become part of a winning team
                  that transforms lives through financial security and
                  protection.
                </p>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Active Agents</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">₱2.5B</div>
                  <div className="text-sm text-gray-600">Assets Protected</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">15+</div>
                  <div className="text-sm text-gray-600">Years Excellence</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 relative z-10">
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src="/RoyalEaglesLogo1.png"
                    alt="Team Success"
                    className="w-20 h-20 rounded-full object-cover border-4 border-green-100"
                  />
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      Join Our Success Story
                    </h3>
                    <p className="text-green-600 font-medium">
                      Life Champions Community
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  Be part of a global winning team that offers purposeful life,
                  personal growth, and career advancement in the financial
                  services industry.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Phone className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="font-medium">+63 917 123 4567</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Mail className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="font-medium">aquila@royaleagles.ph</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Instagram className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="font-medium">@royaleagles_aquila</span>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-200 rounded-full opacity-20"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-green-100 rounded-full opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-800 py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-orange-500 mb-4">
              Ready to Become a Life Champion?
            </h2>
            <p className="text-green-100 text-lg mb-8 leading-relaxed">
              Join thousands of successful financial advisors who have built
              thriving careers with Manulife. Your journey to financial
              independence starts here.
            </p>
            <button
              className="bg-white text-orange-500 hover:bg-gray-50 px-10 py-4 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              onClick={() => navigate("/application-form")}
            >
              Apply Now - It's Free!
            </button>
            <p className="text-green-200 text-sm mt-4">
              ✓ No experience required ✓ Comprehensive training provided ✓
              Unlimited earning potential
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-orange-500 text-4xl font-bold text-center mb-12">
            OUR PRODUCTS
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
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
            © 2024 Royal Eagles Insurance. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RoyalEaglesTemplate;
