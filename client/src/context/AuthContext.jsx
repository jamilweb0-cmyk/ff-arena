import { createContext, useEffect, useState } from "react";
import api from "../services/axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD USER ON REFRESH
  // =========================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch (error) {
        // ✅ 401 error handle করুন (user not logged in)
        if (error.response?.status === 401) {
          console.log("User not logged in");
          setUser(null);
        } else {
          console.error("Auth check failed:", error);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // =========================
  // LOGIN
  // =========================
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      // Fetch logged in user
      const userRes = await api.get("/auth/me");
      setUser(userRes.data);

      return res.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      localStorage.removeItem("userEmail");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;