import { useState, useEffect } from "react";
import { useAuth } from "../lib/authContext";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user, signOut } = useAuth();
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

      const response = await fetch("http://localhost:3000/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          contact_number: formData.contactNumber,
          address: formData.address,
          date_of_birth: dateOfBirth
        })
      });

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
    if (user?.user_metadata) {
      const metadata = user.user_metadata;
      const dob = metadata.date_of_birth
        ? new Date(metadata.date_of_birth)
        : null;

      setFormData({
        firstName: metadata.first_name || "",
        lastName: metadata.last_name || "",
        contactNumber: metadata.contact_number || "",
        address: metadata.address || "",
        day: dob ? dob.getDate().toString() : "",
        month: dob ? (dob.getMonth() + 1).toString() : "",
        year: dob ? dob.getFullYear().toString() : "",
      });
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">
            Dashboard
          </Link>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Edit
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          )}

          <button
            onClick={signOut}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="flex bg-white rounded-lg shadow overflow-hidden max-w-6xl mx-auto">
        {/* Left Sidebar */}
        <div className="w-72 bg-gray-50 border-r px-6 py-8">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <img
                src="https://via.placeholder.com/80"
                alt="Profile"
                className="w-20 h-20 rounded-full"
              />
              <span className="absolute bottom-0 right-0 bg-green-600 text-white text-xs p-1 rounded-full cursor-pointer">
                ✎
              </span>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-gray-800">Manny</h2>
            <p className="text-gray-500 text-sm">+63 912 345 6789</p>
            <p className="text-gray-400 text-xs mt-1">Last update 12-11-2020</p>
          </div>

          <nav className="mt-8 space-y-3">
            <button className="w-full flex items-center px-4 py-2 rounded-lg bg-green-100 text-green-700 font-semibold">
              <span className="mr-3">👤</span> Personal Information
            </button>
            <button className="w-full flex items-center px-4 py-2 rounded-lg hover:bg-gray-100">
              <span className="mr-3">💰</span> Financial Information
            </button>
            <button className="w-full flex items-center px-4 py-2 rounded-lg hover:bg-gray-100">
              <span className="mr-3">➕</span> Health Plan
            </button>
            <button className="w-full flex items-center px-4 py-2 rounded-lg hover:bg-gray-100">
              <span className="mr-3">📅</span> Retirement Plan
            </button>
            <button className="w-full flex items-center px-4 py-2 rounded-lg hover:bg-gray-100">
              <span className="mr-3">🏠</span> Family Plan
            </button>
            <button className="w-full flex items-center px-4 py-2 rounded-lg hover:bg-gray-100">
              <span className="mr-3">🎓</span> Education Plan
            </button>
          </nav>
        </div>

        {/* Right Form */}
        <div className="flex-1 p-8">
          <div className="space-y-8">
            {/* PERSONAL INFORMATION */}
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                PERSONAL INFORMATION
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full border border-green-300 rounded-md px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full border border-green-300 rounded-md px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full border border-green-300 rounded-md px-4 py-2 bg-white"
                  >
                    <option value="">Please select</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1">
                    Date of Birth
                  </label>
                  <div className="flex gap-2">
                    <select
                      name="day"
                      value={formData.day}
                      onChange={handleInputChange}
                      className="w-1/3 border border-green-300 rounded-md px-2 py-2 bg-white"
                      disabled={!isEditing}
                    >
                      <option value="">DD</option>
                      {[...Array(31)].map((_, i) => (
                        <option key={i} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <select
                      name="month"
                      value={formData.month}
                      onChange={handleInputChange}
                      className="w-1/3 border border-green-300 rounded-md px-2 py-2 bg-white"
                      disabled={!isEditing}
                    >
                      <option value="">MM</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="w-1/3 border border-green-300 rounded-md px-2 py-2 bg-white"
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

                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full border border-green-300 rounded-md px-4 py-2 bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1">
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <select
                      className="w-1/3 border border-green-300 rounded-md px-2 py-2 bg-white"
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
                      className="w-2/3 border border-green-300 rounded-md px-4 py-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* PERSONAL ADDRESS */}
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                PERSONAL ADDRESS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1">
                    Address 1
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full border border-green-300 rounded-md px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1">
                    City
                  </label>
                  <select
                    className="w-full border border-green-300 rounded-md px-4 py-2 bg-white"
                    disabled={!isEditing}
                  >
                    <option>Please select</option>
                    <option>Manila</option>
                    <option>Tagaytay</option>
                    <option>Cavite City</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1">
                    Country
                  </label>
                  <select
                    className="w-full border border-green-300 rounded-md px-4 py-2 bg-white"
                    disabled={!isEditing}
                  >
                    <option>Please select</option>
                    <option>Philippines</option>
                    <option>Thailand</option>
                    <option>USA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-900 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    className="w-full border border-green-300 rounded-md px-4 py-2"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                PERSONAL ADDRESS
              </h3>
              <textarea
                placeholder="Add notes about customer"
                rows={4}
                className="w-full border border-green-300 rounded-md px-4 py-2"
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
