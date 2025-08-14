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
    day: "",
    month: "",
    year: "",
  });
  const [loading, setLoading] = useState(false);
  const [activeItem, setActiveItem] = useState("profile");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const dateOfBirth =
        formData.day && formData.month && formData.year
          ? `${formData.year}-${formData.month.padStart(
              2,
              "0"
            )}-${formData.day.padStart(2, "0")}`
          : null;

      const response = await fetch(
        "http://localhost:3000/api/auth/update-profile",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first_name: formData.firstName,
            last_name: formData.lastName,
            contact_number: formData.contactNumber,
            address: formData.address,
            date_of_birth: dateOfBirth,
          }),
        }
      );

      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/auth/profile", {
          credentials: "include",
        });
        const result = await response.json();

        if (result.success && result.data) {
          const data = result.data;
          const dob = data.date_of_birth ? new Date(data.date_of_birth) : null;

          setFormData({
            firstName: data.first_name || "",
            lastName: data.last_name || "",
            contactNumber: data.contact_number || "",
            address: data.address || "",
            day: dob ? dob.getDate().toString() : "",
            month: dob ? (dob.getMonth() + 1).toString() : "",
            year: dob ? dob.getFullYear().toString() : "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const renderContent = () => {
    switch (activeItem) {
      case "profile":
        return (
          <div className="min-h-screen bg-gray-100">
            <div className="flex">
              <div className="w-64 bg-white min-h-screen border-r border-gray-200">
                <div className="p-6">
                  <div className="text-center mb-8">
                    <div className="relative inline-block">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <h2 className="mt-3 font-medium text-gray-900">
                      {formData.firstName && formData.lastName
                        ? `${formData.firstName} ${formData.lastName}`
                        : user?.email?.split("@")[0] || "Anonymous"}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {formData.contactNumber || "No contact"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Last update 15-11-2020
                    </p>
                  </div>
                  <nav className="space-y-1">
                    <button className="w-full flex items-center px-3 py-2 rounded-md bg-green-50 border border-green-200">
                      <div className="w-6 h-6 bg-green-500 rounded-sm flex items-center justify-center mr-3">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">
                        Personal Information
                      </span>
                    </button>
                    <button className="w-full flex items-center px-3 py-2 rounded-md hover:bg-gray-50">
                      <div className="w-6 h-6 bg-gray-400 rounded-sm flex items-center justify-center mr-3">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M3 3v18h18v-18h-18zm16 16h-14v-14h14v14zm-10-8h-2v2h2v-2zm0 4h-2v2h2v-2zm4-4h-2v2h2v-2zm0 4h-2v2h2v-2zm4-4h-2v2h2v-2zm0 4h-2v2h2v-2z" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">
                        Financial Information
                      </span>
                    </button>
                    <button className="w-full flex items-center px-3 py-2 rounded-md hover:bg-gray-50">
                      <div className="w-6 h-6 bg-gray-400 rounded-sm flex items-center justify-center mr-3">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">Health Plan</span>
                    </button>
                    <button className="w-full flex items-center px-3 py-2 rounded-md hover:bg-gray-50">
                      <div className="w-6 h-6 bg-gray-400 rounded-sm flex items-center justify-center mr-3">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">
                        Retirement Plan
                      </span>
                    </button>
                    <button className="w-full flex items-center px-3 py-2 rounded-md hover:bg-gray-50">
                      <div className="w-6 h-6 bg-gray-400 rounded-sm flex items-center justify-center mr-3">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">Family Plan</span>
                    </button>
                    <button className="w-full flex items-center px-3 py-2 rounded-md hover:bg-gray-50">
                      <div className="w-6 h-6 bg-gray-400 rounded-sm flex items-center justify-center mr-3">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L23 9l-11-6zm2.82 7.58L12 11.94l-2.82-1.36L12 9.06l2.82 1.52z" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">
                        Education Plan
                      </span>
                    </button>
                  </nav>
                </div>
              </div>
              <div className="flex-1 bg-white">
                <div className="bg-white border-b border-gray-200">
                  <div className="flex items-center justify-between px-4 py-4">
                    <h1 className="text-lg font-medium text-gray-900">
                      Profile
                    </h1>
                    <div className="flex items-center space-x-4">
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600"
                        >
                          Edit
                        </button>
                      ) : (
                        <button
                          onClick={handleSave}
                          disabled={loading}
                          className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 disabled:opacity-50"
                        >
                          {loading ? "Saving..." : "Save"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="max-w-2xl p-6">
                  <div className="mb-8">
                    <div className="flex items-center mb-4">
                      <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
                      <h2 className="text-lg font-medium text-gray-900">
                        PERSONAL INFORMATION
                      </h2>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">
                            Status
                          </label>
                          <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                          >
                            <option value="">Please select</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">
                            Date of Birth
                          </label>
                          <div className="flex gap-1">
                            <select
                              name="day"
                              value={formData.day}
                              onChange={handleInputChange}
                              className="w-1/3 px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              disabled={!isEditing}
                            >
                              <option value="">DD</option>
                              {[...Array(31)].map((_, i) => (
                                <option key={i} value={i + 1}>
                                  {(i + 1).toString().padStart(2, "0")}
                                </option>
                              ))}
                            </select>
                            <select
                              name="month"
                              value={formData.month}
                              onChange={handleInputChange}
                              className="w-1/3 px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              disabled={!isEditing}
                            >
                              <option value="">MM</option>
                              {[...Array(12)].map((_, i) => (
                                <option key={i} value={i + 1}>
                                  {(i + 1).toString().padStart(2, "0")}
                                </option>
                              ))}
                            </select>
                            <select
                              name="year"
                              value={formData.year}
                              onChange={handleInputChange}
                              className="w-1/3 px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              disabled={!isEditing}
                            >
                              <option value="">YYYY</option>
                              {[...Array(100)].map((_, i) => (
                                <option key={i} value={2025 - i}>
                                  {2025 - i}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={user?.email || ""}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <div className="flex gap-1">
                            <select
                              className="w-1/3 px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              disabled={!isEditing}
                            >
                              <option>+66</option>
                              <option>+63</option>
                              <option>+1</option>
                            </select>
                            <input
                              type="tel"
                              name="contactNumber"
                              value={formData.contactNumber}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="w-2/3 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-8">
                    <div className="flex items-center mb-4">
                      <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
                      <h2 className="text-lg font-medium text-gray-900">
                        PERSONAL ADDRESS
                      </h2>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">
                            Address 1
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">
                            City
                          </label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                            disabled={!isEditing}
                          >
                            <option>Please select</option>
                            <option>Manila</option>
                            <option>Tagaytay</option>
                            <option>Cavite City</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">
                            Country
                          </label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                            disabled={!isEditing}
                          >
                            <option>Please select</option>
                            <option>Philippines</option>
                            <option>Thailand</option>
                            <option>USA</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
                      <h2 className="text-lg font-medium text-gray-900">
                        NOTES
                      </h2>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        placeholder="Add notes about customer"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
                {isEditing && (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="fixed bottom-6 right-6 bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 shadow-lg"
                  >
                    Cancel
                  </button>
                )}
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
