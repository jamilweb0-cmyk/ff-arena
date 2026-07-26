import { createContext, useEffect, useState } from "react";
import api from "../services/axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
        localStorage.setItem("userEmail", res.data.email);
      } catch (error) {
        if (error.response?.status === 401) {
          setUser(null);
          localStorage.removeItem("userEmail");
        } else {
          console.error("Auth check failed:", error);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    setUser(res.data.user);
    localStorage.setItem("userEmail", res.data.user.email);
    return res.data;
  };

  const googleLogin = async (firebaseUser) => {
    const res = await api.post("/auth/google", {
      name: firebaseUser.displayName,
      email: firebaseUser.email,
      photo: firebaseUser.photoURL,
    });
    setUser(res.data.user);
    localStorage.setItem("userEmail", res.data.user.email);
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.log(error);
    }
    setUser(null);
    localStorage.removeItem("userEmail");
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, googleLogin, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;