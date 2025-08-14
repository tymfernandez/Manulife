import { createContext, useContext, useEffect, useState } from "react";
import { logLogin, logLogout } from "../utils/activityLogger";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/auth/session");
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
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          fullName: additionalData.fullName || "",
          contactNumber: additionalData.contactNumber || "",
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      return result.success
        ? { data: result.data, error: null }
        : { data: null, error: { message: result.message } };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      if (result.success && result.data.user) {
        setUser(result.data.user);
        // Fetch user profile for activity logging
        try {
          const profileResponse = await fetch("http://localhost:3000/api/auth/profile", {
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
      return { data: null, error: { message: result.message } };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  };
  const signOut = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/signout", {
        method: "POST",
      });
      const result = await response.json();
      if (result.success) {
        // Log logout activity before clearing user
        if (user) logLogout(user, userProfile);
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
      value={{ user, userProfile, signUp, signIn, signOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
