import { createContext, useContext, useEffect, useState } from "react";
import { logLogin, logLogout } from "../utils/activityLogger";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // MFA verification function
  const verifyMfaLogin = async (userId, code) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/mfa/verify-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, code }),
      });

      const result = await response.json();
      if (result.success && result.data.user) {
        // Store session in localStorage after MFA verification
        const sessionData = {
          access_token: result.data.session.access_token,
          refresh_token: result.data.session.refresh_token,
          expires_at: result.data.session.expires_at,
          user: result.data.user
        };
        localStorage.setItem('supabase.auth.token', JSON.stringify(sessionData));
        localStorage.removeItem('supabase.auth.temp');
        
        setUser(result.data.user);
        // Log successful login
        logLogin(result.data.user, null);
        return { data: result.data, error: null };
      }
      return { data: null, error: { message: result.message } };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  };

  useEffect(() => {
    const getSession = async () => {
      try {
        // Get session from localStorage (per-user storage)
        const storedSession = localStorage.getItem('supabase.auth.token');
        if (storedSession) {
          const sessionData = JSON.parse(storedSession);
          if (sessionData.access_token && sessionData.expires_at > Date.now() / 1000) {
            setUser(sessionData.user);
          } else {
            localStorage.removeItem('supabase.auth.token');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();
  }, []);

  const signUp = async (email, password, additionalData = {}) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          fullName: additionalData.fullName || "",
          contactNumber: additionalData.contactNumber || "",
          personalCode: additionalData.personalCode || "",
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      return result.success
        ? { data: result.data, error: null, message: result.message }
        : { data: null, error: { message: result.message } };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      });

      const result = await response.json();

      
      if (!response.ok) {
        return { data: null, error: { message: result.message || `Server error: ${response.status}` } };
      }

      
      if (!result.success) {
        return { data: null, error: { message: result.message } };
      }
      
      // Check if MFA is required
      if (result.requiresMfa) {
        // Store temp session for MFA verification
        const tempSessionData = {
          tempUserId: result.tempUserId,
          requiresMfa: true
        };
        localStorage.setItem('supabase.auth.temp', JSON.stringify(tempSessionData));
        
        return { 
          data: null, 
          error: null, 
          requiresMfa: true, 
          tempUserId: result.tempUserId 
        };
      }
      
      if (result.data?.user) {
        // Store session in localStorage for this specific user
        const sessionData = {
          access_token: result.data.session.access_token,
          refresh_token: result.data.session.refresh_token,
          expires_at: result.data.session.expires_at,
          user: result.data.user
        };
        localStorage.setItem('supabase.auth.token', JSON.stringify(sessionData));
        
        setUser(result.data.user);
        // Fetch user profile for activity logging
        try {
          const profileResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/profile`, {
            credentials: "include",
            headers: {
              'Authorization': `Bearer ${result.data.session.access_token}`
            }
          });
          const profileResult = await profileResponse.json();
          const profile = profileResult.success && profileResult.data ? {
            firstName: profileResult.data.first_name || "",
            lastName: profileResult.data.last_name || "",
            role: profileResult.data.role || "User"
          } : null;
          setUserProfile(profile);
          // Log login activity with profile
          logLogin(result.data.user, profile);
        } catch (profileError) {
          console.error('Error fetching profile for login log:', profileError);
          logLogin(result.data.user, null);
        }
        return { data: result.data, error: null };
      }
      
      return { data: null, error: { message: result.message || "Login failed" } };
    } catch (error) {
      console.error('SignIn client error:', error);
      return { data: null, error: { message: "Network error. Please try again." } };
    }
  };
  const signOut = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/signout`, {
        method: "POST",
      });
      const result = await response.json();
      if (result.success) {
        // Log logout activity before clearing user
        if (user) logLogout(user, userProfile);
        
        // Clear localStorage session
        localStorage.removeItem('supabase.auth.token');
        
        // Clear role cache
        const { clearRoleCache } = await import('../hooks/useRole');
        clearRoleCache();
        
        setUser(null);
        setUserProfile(null);
        return { error: null };
      }
      return { error: { message: result.message } };
    } catch (error) {
      return { error: { message: error.message } };
    }
  };

  const resetPassword = async (email) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      return result.success
        ? { data: result.data, error: null, message: result.message }
        : { data: null, error: { message: result.message } };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, userProfile, signUp, signIn, signOut, verifyMfaLogin, resetPassword, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
