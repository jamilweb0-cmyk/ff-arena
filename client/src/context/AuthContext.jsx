import { createContext, useState } from "react";
import api from "../services/axios";

export const AuthContext = createContext(null);

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      if (res.data.user) {
        localStorage.setItem("userEmail", res.data.user.email);
        localStorage.setItem("userName", res.data.user.name || "");
        localStorage.setItem("userPhoto", res.data.user.photo || "");
        setUser(res.data.user);
      }
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (userData) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/google", {
        name: userData.name,
        email: userData.email,
        photo: userData.photo,
        googleId: userData.googleId || "",
      });
      
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        console.log("✅ Token saved:", res.data.token);
      }
      
      localStorage.setItem("userEmail", userData.email);
      localStorage.setItem("userName", userData.name || "");
      localStorage.setItem("userPhoto", userData.photo || "");
      
      setUser(res.data.user || {
        email: userData.email,
        name: userData.name,
        photo: userData.photo,
      });
      
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userPhoto");
  };

  const authInfo = { user, loading, login, googleLogin, logout };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;