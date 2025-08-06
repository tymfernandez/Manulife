import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/auth/session");
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
      const response = await fetch("http://localhost:3001/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          fullName: additionalData.fullName || "",
          contactNumber: additionalData.contactNumber || "",
        }),
      });

      const result = await response.json();
      return result.success
        ? { data: result.data, error: null }
        : { data: null, error: { message: result.message } };
    } catch (error) {
      return {
        data: null,
        error: { message: "Network error. Please check your connection." },
      };
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await fetch("http://localhost:3001/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      
      if (result.success && result.data.user) {
        setUser(result.data.user);
        return { data: result.data, error: null };
      }
      return { data: null, error: { message: result.message } };
    } catch (error) {
      return {
        data: null,
        error: { message: "Network error. Please check your connection." },
      };
    }
  };
  const signOut = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/auth/signout", {
        method: "POST",
      });
      const result = await response.json();
      if (result.success) {
        setUser(null);
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
