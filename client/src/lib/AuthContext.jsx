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
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/session`);
        const result = await response.json();
        setUser(result.success && result.session ? result.session.user : null);
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
        return { 
          data: null, 
          error: null, 
          requiresMfa: true, 
          tempUserId: result.tempUserId 
        };
      }
      
      if (result.data?.user) {
        setUser(result.data.user);
        // Fetch user profile for activity logging
        try {
          const profileResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/profile`, {
            credentials: "include",
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

  return (
    <AuthContext.Provider
      value={{ user, userProfile, signUp, signIn, signOut, verifyMfaLogin, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
