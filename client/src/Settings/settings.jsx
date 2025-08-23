import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import SideBar from "../components/Sidebar";
import Header from "../components/Header";
import UserAccount from "./Components/userAccount";
import HelpSupport from "./Components/helpSupport";
import { passwordService } from '../services/passwordService';
import { useAuth } from '../lib/authContext';

const SettingsPage = () => {
  const { user } = useAuth();
  const [activeItem, setActiveItem] = useState("settings");
  const tabs = ["User Account", "Support & Help"];
  const [activeTab, setActiveTab] = useState("User Account");
  
  // Modal states
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showRecoverPassword, setShowRecoverPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [recoverEmail, setRecoverEmail] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  const handleChangePassword = async () => {
    if (!passwordService.validatePasswordMatch(passwordData.newPassword, passwordData.confirmPassword)) {
      alert('New passwords do not match');
      return;
    }

    const validation = passwordService.validatePassword(passwordData.newPassword);
    if (!validation.isValid) {
      alert(validation.errors[0]);
      return;
    }

    try {
      setPasswordLoading(true);
      const result = await passwordService.changePassword(passwordData.currentPassword, passwordData.newPassword, user?.id);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      alert('Password updated successfully!');
      setShowChangePassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password: ' + error.message);
    } finally {
      setPasswordLoading(false);
    }
  };
  
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };
  
  const handleRecoverPassword = async () => {
    if (!recoverEmail) {
      alert('Please enter your email address');
      return;
    }

    try {
      setPasswordLoading(true);
      const result = await passwordService.sendPasswordResetEmail(recoverEmail);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      alert('Password reset link sent to your email!');
      setShowRecoverPassword(false);
      setRecoverEmail('');
    } catch (error) {
      console.error('Error sending recovery email:', error);
      alert('Failed to send recovery email: ' + error.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SideBar activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className="flex-1 flex flex-col">
        <Header activeItem={activeItem} setActiveItem={setActiveItem} />
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Top Header */}
          <div className="flex items-center justify-between p-6 ">
            <h1 className="text-3xl font-bold text-green-800text-3xl font-bold text-emerald-800">
              SETTINGS
            </h1>
          </div>

          {/* Settings Content */}
          <div className="px-6">
            {/* Tabs */}
            <div className="mb-8">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab
                          ? "border-green-500 text-green-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Settings Content Based on Active Tab */}
            {activeTab === "User Account" && <UserAccount setShowChangePassword={setShowChangePassword} setShowRecoverPassword={setShowRecoverPassword} />}
            {activeTab === "Data & Exports" && <DataExports />}
            {activeTab === "Support & Help" && <HelpSupport />}
          </div>
        </div>
        
        {/* Change Password Modal */}
        {showChangePassword && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-20 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-emerald-800">Change Password</h3>
                <button
                  onClick={() => {
                    setShowChangePassword(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      placeholder="Enter current password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowChangePassword(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={passwordLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Recover Password Modal */}
        {showRecoverPassword && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-20 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-emerald-800">Password Recovery</h3>
                <button
                  onClick={() => {
                    setShowRecoverPassword(false);
                    setRecoverEmail('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={recoverEmail}
                    onChange={(e) => setRecoverEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  We'll send a password reset link to this email address.
                </p>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowRecoverPassword(false);
                    setRecoverEmail('');
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRecoverPassword}
                  disabled={passwordLoading || !recoverEmail}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {passwordLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </div>
          </div>
        )}

        <style>{`
          .toggle-checkbox:checked {
            right: 0;
            border-color: #10b981;
            background-color: #10b981;
          }
          .toggle-checkbox {
            transition: all 0.3s ease;
            top: 0;
            left: 0;
          }
          .toggle-label {
            transition: all 0.3s ease;
          }
          .toggle-checkbox:checked + .toggle-label {
            background-color: #10b981;
          }
        `}</style>
      </div>
    </div>
  );
};

export default SettingsPage;
