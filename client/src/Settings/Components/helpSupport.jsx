import React, { useState } from "react";
import { ChevronDown, Phone, Mail, MessageCircle } from "lucide-react";
import { settingsService } from '../../services/settingsService';

const HelpSupport = () => {
  const [issueType, setIssueType] = useState("Select Issue Type");
  const [priorityType, setPriorityType] = useState("Low");
  const [description, setDescription] = useState("");
  const [issueDropdownOpen, setIssueDropdownOpen] = useState(false);
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);

  const issueTypes = [
    "Login Issue",
    "Bug Report",
    "Feature Request",
    "Account Problem",
    "Payment Issue",
    "Technical Support",
  ];

  const priorityTypes = ["Low", "Medium", "High", "Critical"];

  return (
    <div className="space-y-6">
      {/* Contact IT/Admin Support Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          Contact IT/Admin Support
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Side - Submit Support Ticket */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">
              Submit A Support Ticket
            </h4>

            <div className="space-y-4">
              {/* Issue Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Type
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIssueDropdownOpen(!issueDropdownOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <span
                      className={
                        issueType === "Select Issue Type"
                          ? "text-gray-400"
                          : "text-gray-900"
                      }
                    >
                      {issueType}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        issueDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {issueDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                      {issueTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            setIssueType(type);
                            setIssueDropdownOpen(false);
                          }}
                          className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Priority Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Type
                </label>
                <div className="relative">
                  <button
                    onClick={() =>
                      setPriorityDropdownOpen(!priorityDropdownOpen)
                    }
                    className="w-full flex items-center justify-between px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <span>{priorityType}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        priorityDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {priorityDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                      {priorityTypes.map((priority) => (
                        <button
                          key={priority}
                          onClick={() => {
                            setPriorityType(priority);
                            setPriorityDropdownOpen(false);
                          }}
                          className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
                        >
                          {priority}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please Describe Your Issue In Detail"
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none text-sm"
                />
              </div>

              {/* Submit Button */}
              <button 
                onClick={async () => {
                  try {
                    if (!issueType || issueType === 'Select Issue Type' || !description.trim()) {
                      alert('Please fill in all required fields');
                      return;
                    }
                    
                    await settingsService.submitTicket({
                      issueType,
                      priority: priorityType,
                      description
                    });
                    
                    alert('Support ticket submitted successfully!');
                    setIssueType('Select Issue Type');
                    setPriorityType('Low');
                    setDescription('');
                  } catch (error) {
                    alert('Error submitting ticket: ' + error.message);
                  }
                }}
                className="w-full py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
              >
                Submit Ticket
              </button>
            </div>
          </div>

          {/* Right Side - Direct Contact */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Direct Contact</h4>

            <div className="space-y-4">
              {/* Help Desk Card */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900 mb-1">Help Desk</h5>
                    <p className="text-sm text-gray-600 mb-2">
                      Available 24/7 For Urgent Issues
                    </p>
                    <a href="tel:+18001234567" className="text-sm text-green-700 font-semibold hover:text-green-800 transition-colors">
                      +1 (800) 123-4567
                    </a>
                  </div>
                </div>
              </div>

              {/* Email Support Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900 mb-1">Email Support</h5>
                    <p className="text-sm text-gray-600 mb-2">
                      Response Within 24 Hours
                    </p>
                    <a href="mailto:support@company.com" className="text-sm text-blue-700 font-semibold hover:text-blue-800 transition-colors break-all">
                      support@company.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Live Chat Card */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle size={20} className="text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900 mb-1">Live Chat</h5>
                    <p className="text-sm text-gray-600 mb-3">
                      Available Monday-Friday, 9am-5pm
                    </p>
                    <button className="text-sm bg-purple-600 text-white px-3 py-1.5 rounded-md font-medium hover:bg-purple-700 transition-colors">
                      Start Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
