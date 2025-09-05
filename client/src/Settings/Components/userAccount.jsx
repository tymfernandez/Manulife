import React, { useState, useEffect } from "react";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { settingsService } from '../../services/settingsService';
import { supabase } from '../../supabaseClient';
import { passwordService } from '../../services/passwordService';
import { useAuth } from '../../lib/AuthContext';

const UserAccount = ({ setShowChangePassword, setShowRecoverPassword }) => {
  const { user } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [settings, setSettings] = useState({
    two_factor_enabled: false,
  });
  const [loading, setLoading] = useState(false);
  // MFA state variables
  const [mfaEnabled, setMfaEnabled] = useState(false); // Track if MFA is enabled
  const [showMfaSetup, setShowMfaSetup] = useState(false); // Show/hide setup UI
  const [qrCode, setQrCode] = useState(''); // QR code for authenticator app
  const [verificationCode, setVerificationCode] = useState(''); // User input code
  const [mfaSecret, setMfaSecret] = useState(''); // Temporary secret storage
  


  useEffect(() => {
    loadSettings();
    checkMfaStatus();
  }, []);

  // Check if user has MFA enabled
  const checkMfaStatus = async () => {
    try {
      const storedSession = localStorage.getItem('supabase.auth.token');
      if (!storedSession) {
        setMfaEnabled(false);
        return;
      }
      
      const sessionData = JSON.parse(storedSession);
      if (!sessionData.access_token) {
        setMfaEnabled(false);
        return;
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/mfa/status`, {
        headers: {
          'Authorization': `Bearer ${sessionData.access_token}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setMfaEnabled(result.enabled);
      }
    } catch (error) {
      setMfaEnabled(false);
    }
  };

  // Start MFA enrollment process
  const enableMfa = async () => {
    try {
      setLoading(true);
      
      const storedSession = localStorage.getItem('supabase.auth.token');
      if (!storedSession) {
        throw new Error('No session available');
      }
      
      const sessionData = JSON.parse(storedSession);
      if (!sessionData.access_token) {
        throw new Error('No access token available');
      }
      
      // Call custom MFA enroll endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/mfa/enroll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionData.access_token}`
        }
      });
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }
      
      // Store secret temporarily
      setMfaSecret(result.data.secret);
      setQrCode(result.data.qrCode);
      setShowMfaSetup(true);
    } catch (error) {
      alert('Failed to enable MFA: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyMfa = async () => {
    try {
      setLoading(true);
      
      const storedSession = localStorage.getItem('supabase.auth.token');
      if (!storedSession) {
        throw new Error('No session available');
      }
      
      const sessionData = JSON.parse(storedSession);
      if (!sessionData.access_token) {
        throw new Error('No access token available');
      }
      
      // Call custom verify endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/mfa/verify`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionData.access_token}`
        },
        body: JSON.stringify({
          secret: mfaSecret,
          code: verificationCode
        })
      });
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }
      
      // Success - update UI
      setMfaEnabled(true);
      setShowMfaSetup(false);
      setQrCode('');
      setVerificationCode('');
      setMfaSecret('');
      alert('MFA enabled successfully!');
    } catch (error) {
      alert('Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const disableMfa = async () => {
    if (!confirm('Are you sure you want to disable MFA?')) return;
    try {
      setLoading(true);
      
      const storedSession = localStorage.getItem('supabase.auth.token');
      if (!storedSession) {
        throw new Error('No session available');
      }
      
      const sessionData = JSON.parse(storedSession);
      if (!sessionData.access_token) {
        throw new Error('No access token available');
      }
      
      // Call disable endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/mfa/disable`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionData.access_token}`
        }
      });
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }
      
      setMfaEnabled(false);
      alert('MFA disabled successfully');
    } catch (error) {
      alert('Failed to disable MFA');
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const userSettings = await settingsService.getUserSettings();
      setSettings(userSettings);
      setSelectedLanguage(userSettings.language || 'English');
    } catch (error) {
      // Handle error silently
    }
  };

  const updateSetting = async (key, value) => {
    try {
      setLoading(true);
      const updatedSettings = { ...settings, [key]: value };
      await settingsService.updateSettings(updatedSettings);
      setSettings(updatedSettings);
    } catch (error) {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };







  return (
    <>
    <div className="space-y-6">
      {/* Password Management */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Password Management
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <h4 className="font-medium text-gray-900">
                Change Password
              </h4>
              <p className="text-sm text-gray-500">
                Update Your Password Regularly To Keep Your Account Secure.
              </p>
            </div>
            <button 
              onClick={() => setShowChangePassword?.(true)}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
            >
              Change Password
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <h4 className="font-medium text-gray-900">
                Recover Password
              </h4>
              <p className="text-sm text-gray-500">
                Send A Password Reset Link To Your Email.
              </p>
            </div>
            <button 
              onClick={() => setShowRecoverPassword?.(true)}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
            >
              Send Reset Link
            </button>
          </div>
        </div>




      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Two-Factor Authentication
        </h3>

        {!showMfaSetup ? (
          <div className="flex items-center justify-between py-3">
            <div>
              <h4 className="font-medium text-gray-900">
                Enable Two-Factor Authentication
              </h4>
              <p className="text-sm text-gray-500">
                Add An Extra Layer Of Security To Your Account With 2FA.
              </p>
            </div>
            <div className="flex items-center">
              <span className={`text-sm mr-3 ${
                mfaEnabled ? 'text-green-600' : 'text-gray-500'
              }`}>
                {mfaEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <button
                onClick={mfaEnabled ? disableMfa : enableMfa}
                disabled={loading}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  mfaEnabled
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                } disabled:opacity-50`}
              >
                {loading ? 'Processing...' : mfaEnabled ? 'Disable MFA' : 'Enable MFA'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Setup Instructions:</h4>
              <ol className="text-sm text-gray-600 space-y-1">
                <li>1. Install an authenticator app (Google Authenticator, Authy, etc.)</li>
                <li>2. Scan the QR code below</li>
                <li>3. Enter the 6-digit code from your app</li>
              </ol>
            </div>
            
            {qrCode && (
              <div className="flex justify-center">
                <img src={qrCode} alt="MFA QR Code" className="border rounded-lg" />
              </div>
            )}
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                maxLength={6}
              />
              <button
                onClick={verifyMfa}
                disabled={loading || verificationCode.length !== 6}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
            
            <button
              onClick={() => setShowMfaSetup(false)}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

    </div>
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
    </>
  );
};

export default UserAccount;