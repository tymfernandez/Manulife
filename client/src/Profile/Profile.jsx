import { useState, useEffect } from "react";
import { useAuth } from "../lib/authContext";
import Header from "../components/Header";
import SideBar from "../components/Sidebar";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    address: "",
  });
  const [savedData, setSavedData] = useState({
    contactNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [activeItem, setActiveItem] = useState("profile");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'contactNumber') {
      // Only allow digits and limit to 11 characters
      const numericValue = value.replace(/\D/g, '').slice(0, 11);
      setFormData({
        ...formData,
        [name]: numericValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const fetchProfile = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch("http://localhost:3000/api/auth/profile", {
        headers: {
          'user-id': user.id
        }
      });
      const result = await response.json();

      if (result.success && result.data) {
        const data = result.data;
        
        setFormData({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          contactNumber: data.contact_number || "",
          address: data.address || "",
        });
        setSavedData({
          contactNumber: data.contact_number || "",
          address: data.address || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleSave = async () => {
    if (!user?.id) {
      alert("Please log in to save profile changes.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/update-profile",
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "user-id": user.id
          },
          body: JSON.stringify({
            first_name: formData.firstName,
            last_name: formData.lastName,
            contact_number: formData.contactNumber,
            address: formData.address,
          })
        }
      );

      const result = await response.json();
      if (!result.success) throw new Error(result.message);

      setIsEditing(false);
      await fetchProfile();
      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (activeItem === "profile") {
      fetchProfile();
    }
  }, [activeItem]);

  const sidebarItems = [
    { id: 1, label: "Personal Information", icon: "👤", active: true },

  ];

  const renderContent = () => {
    switch (activeItem) {
      case "profile":
        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="flex">
              {/* Enhanced Sidebar */}
              <div className="w-80 bg-white min-h-screen shadow-xl border-r border-gray-200">
                <div className="p-8">
                  {/* Profile Avatar Section */}
                  <div className="text-center mb-10">
                    <div className="relative inline-block group">
                      <div
                        className="w-24 h-24 bg-gradient-to-br from-orange-300 to-orange-500
                      -600 rounded-full flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-105"
                      >
                        <svg
                          className="w-12 h-12 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {formData.firstName && formData.lastName
                          ? `${formData.firstName} ${formData.lastName}`
                          : user?.email?.split("@")[0] || "Anonymous"}
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        {formData.contactNumber || "No contact"}
                      </p>
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></span>
                        Active
                      </div>
                    </div>
                  </div>

                  {/* Navigation Menu */}
                  <nav className="space-y-2">
                    {sidebarItems.map((item) => (
                      <button
                        key={item.id}
                        className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                          item.active
                            ? "bg-gradient-to-r from-emerald-50 to-orange-100 border border-orange-200 shadow-sm"
                            : "hover:bg-gray-50 hover:shadow-sm"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                            item.active
                              ? "bg-emerald-500 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <span className="text-sm">{item.icon}</span>
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            item.active ? "text-green-800" : "text-gray-700"
                          }`}
                        >
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 bg-white">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between px-8 py-6">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        Profile Settings
                      </h1>
                      <p className="text-sm text-gray-600 mt-1">
                        Manage your personal information and preferences
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="bg-orange-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Edit Profile
                        </button>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50 flex items-center"
                          >
                            {loading ? (
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            ) : (
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                            {loading ? "Saving..." : "Save Changes"}
                          </button>
                          <button
                            onClick={() => setIsEditing(false)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Content */}
                <div className="p-8">
                  <div className="max-w-4xl mx-auto space-y-8">
                    {/* Personal Information Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="bg-gradient-to-r from-orange-100 to-emerald-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center">
                          <div className="w-2 h-8 bg-orange-500 rounded-full mr-4"></div>
                          <h2 className="text-lg font-semibold text-gray-900">
                            Personal Information
                          </h2>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              First Name
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                              placeholder="Enter your first name"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Last Name
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                              placeholder="Enter your last name"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Email Address
                            </label>
                            <input
                              type="email"
                              value={user?.email || ""}
                              disabled
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Phone Number (11 digits)
                            </label>
                            <input
                              type="tel"
                              name="contactNumber"
                              value={formData.contactNumber}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              maxLength="11"
                              pattern="[0-9]{11}"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                              placeholder="Enter 11-digit phone number"
                            />
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Address
                            </label>
                            <input
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                              placeholder="Enter your full address"
                            />
                          </div>
                        </div>
                      </div>
                    </div>


                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="min-h-full">
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
              <p className="text-gray-600 mt-2">
                Settings features coming soon...
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SideBar activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className="flex-1 flex flex-col">
        <Header activeItem={activeItem} setActiveItem={setActiveItem} />
        <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default Profile;
