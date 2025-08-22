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
      image: "/api/placeholder/300/200",
    },
    {
      id: 2,
      title: "SAVINGS",
      description:
        "Secure your future with our comprehensive savings plans and retirement solutions.",
      image: "/api/placeholder/300/200",
    },
    {
      id: 3,
      title: "EDUCATION",
      description:
        "Invest in education and skill development for long-term career advancement.",
      image: "/api/placeholder/300/200",
    },
    {
      id: 4,
      title: "HEALTH",
      description:
        "Comprehensive health insurance and wellness programs for you and your family.",
      image: "/api/placeholder/300/200",
    },
    {
      id: 5,
      title: "RETIREMENT",
      description:
        "Plan for a comfortable retirement with our tailored retirement solutions.",
      image: "/api/placeholder/300/200",
    },
    {
      id: 6,
      title: "PROTECTION",
      description:
        "Protect your assets and loved ones with our comprehensive insurance coverage.",
      image: "/api/placeholder/300/200",
    },
    {
      id: 7,
      title: "GROUP PRODUCTS",
      description:
        "Specialized group insurance and benefits for organizations and businesses.",
      image: "/api/placeholder/300/200",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-slate-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-slate-800 font-bold text-sm">RE</span>
            </div>
            <div>
              <div className="font-bold text-lg">Royal Eagles</div>
              <div className="text-xs text-gray-300">Insurance</div>
            </div>
          </div>
          <button
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm font-medium"
            onClick={() => navigate("/signin")}
          >
            LOGIN
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-slate-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="text-orange-400">
                  <svg
                    className="w-16 h-16"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
                    <path d="M8 12l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">
                    Join our
                    <br />
                    region
                  </h1>
                  <p className="text-xl text-gray-300">
                    Keep hustling to the finish line.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 text-gray-800">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src="/api/placeholder/300/200"
                  alt="Team members"
                  className="w-32 h-24 rounded object-cover"
                />
                <div className="text-green-600">
                  <p className="font-medium mb-2">
                    Be part of a global winning team that offers you purposeful
                    life, personal and career growth and work-life integration.
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+123 456 7890</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Instagram className="w-4 h-4" />
                  <span>@re_eagles</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>email_address@domain.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-orange-500 mb-4">
            Belong here. Be a Life Champion.
          </h2>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold text-lg mb-4"
            onClick={() => navigate("/application-form")}
          >
            APPLY NOW!
          </button>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Welcome to Royal Eagles
            </h3>
            <p className="text-orange-500 font-medium">
              Your journey starts now
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="bg-slate-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-white text-2xl font-bold text-center mb-12">
            OUR PRODUCTS
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg"
              >
                <div className="h-48 bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-500">Product Image</span>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-3 text-center text-gray-800">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
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
