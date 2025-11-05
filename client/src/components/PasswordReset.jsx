import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { passwordService } from '../services/passwordService';
import { Eye, EyeOff } from 'lucide-react';

// Import images directly
import carousel01 from "/Carousel01.png";
import carousel02 from "/Carousel02.png";
import carousel03 from "/Carousel03.png";

const PasswordReset = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [isValidSession, setIsValidSession] = useState(false);

  useEffect(() => {
    const handleAuthStateChange = async () => {
      // Check both hash and query parameters
      const hash = window.location.hash.substring(1);
      const search = window.location.search.substring(1);
      
      let params;
      let type, token, refresh;
      
      if (hash) {
        params = new URLSearchParams(hash);
        type = params.get('type');
        token = params.get('access_token');
        refresh = params.get('refresh_token');
      } else if (search) {
        params = new URLSearchParams(search);
        type = params.get('type');
        token = params.get('token') || params.get('access_token');
        refresh = params.get('refresh_token');
      }
      
      console.log('Hash:', hash);
      console.log('Search:', search);
      console.log('Type:', type);
      console.log('Token:', !!token);
      
      if (type === 'recovery' && token) {
        console.log('Found recovery tokens:', { token: token.substring(0, 20) + '...', refresh: refresh ? refresh.substring(0, 20) + '...' : 'none' });
        setAccessToken(token);
        if (refresh) setRefreshToken(refresh);
        setIsValidSession(true);
        // Don't clear URL yet - keep for debugging
        // window.history.replaceState(null, null, window.location.pathname);
      } else if (!hash && !search) {
        setError('Please use the reset link from your email.');
      } else {
        console.log('Invalid tokens found:', { type, hasToken: !!token, hash, search });
        setError('Invalid reset link. Please request a new password reset.');
      }
    };
    
    handleAuthStateChange();
  }, []);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (!passwordService.validatePasswordMatch(password, confirmPassword)) {
      setError('Passwords do not match');
      return;
    }
    
    const validation = passwordService.validatePassword(password);
    if (!validation.isValid) {
      setError(validation.errors[0]);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Use Supabase client to update password directly
      const { supabase } = await import('../supabaseClient');
      
      console.log('Setting session with tokens:', { hasAccess: !!accessToken, hasRefresh: !!refreshToken });
      
      // Set the session with the tokens
      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || 'dummy-refresh-token'
      });
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Failed to establish session: ' + sessionError.message);
      }
      
      console.log('Session set successfully:', !!sessionData.session);
      
      // Update the password
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) {
        console.error('Update user error:', error);
        throw new Error(error.message);
      }
      
      alert('Password updated successfully! You can now log in with your new password.');
      navigate('/signin');
    } catch (error) {
      console.error('Error updating password:', error);
      setError('Failed to update password: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isValidSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">Invalid Reset Link</h2>
            <p className="mt-2 text-sm text-gray-600">
              {error || 'This password reset link is invalid or has expired.'}
            </p>
            <button
              onClick={() => navigate('/forgot-password')}
              className="mt-4 text-green-600 hover:text-green-500 underline"
            >
              Request a new reset link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row p-4 sm:p-8 md:p-12 lg:p-20">
      {/* Left side - Form */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-4 sm:p-6 md:p-8 rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none shadow-2xl">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
              Create New Password
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Enter your new password below
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-xs sm:text-sm mb-4 sm:mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 pr-12"
                  placeholder="Enter new password"
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
            
            <div>
              <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 pr-12"
                  placeholder="Confirm new password"
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

            <button
              type="submit"
              disabled={loading || !password || !confirmPassword}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
          
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => navigate('/signin')}
              className="text-xs sm:text-sm text-green-600 hover:text-green-700"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>

      {/* Right side - Carousel */}
      <div className="flex-1 relative overflow-hidden rounded-b-2xl lg:rounded-r-2xl lg:rounded-bl-none shadow-2xl min-h-[300px] lg:min-h-full">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
          <div className="bg-green-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded text-xs sm:text-sm font-medium flex items-center">
            <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
            Royal Eagles
          </div>
        </div>

        <div className="relative h-full bg-gray-200">
          <div className="absolute inset-0">
            <img
              src={carousel01}
              alt="Password Reset"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-4">
                Secure Password Update
              </h2>
              <p className="text-xs sm:text-sm opacity-90 leading-relaxed max-w-md">
                Create a strong password to secure your Life Champion account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;