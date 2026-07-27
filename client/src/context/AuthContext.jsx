import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import api from "../services/axios";

export const AuthContext = createContext(null);

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // ✅ ব্যাকএন্ড থেকে ইউজার ডেটা ফেচ করা (Token অটোমেটিক হেডারে যাবে)
          const res = await api.get("/auth/me");
          if (res.data) {
            setUser(res.data);
            localStorage.setItem("userEmail", firebaseUser.email);
            localStorage.setItem("userName", res.data.name || firebaseUser.displayName || "");
            localStorage.setItem("userPhoto", res.data.photo || firebaseUser.photoURL || "");
          }
        } catch (error) {
          console.error("Failed to fetch user from backend:", error);
          // ✅ ফলব্যাক: যদি ব্যাকএন্ড ফেইল করে, লোকাল স্টোরেজ থেকে ডেটা দেখাও
          const savedEmail = localStorage.getItem("userEmail");
          if (savedEmail) {
            setUser({
              email: savedEmail,
              name: localStorage.getItem("userName") || "User",
              photo: localStorage.getItem("userPhoto") || "",
            });
          } else {
            setUser({
              email: firebaseUser.email,
              name: firebaseUser.displayName || "User",
              photo: firebaseUser.photoURL || "",
            });
          }
        }
      } else {
        setUser(null);
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        localStorage.removeItem("userPhoto");
        localStorage.removeItem("token");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    if (res.data.token) localStorage.setItem("token", res.data.token);
    if (res.data.user) {
      localStorage.setItem("userEmail", res.data.user.email);
      localStorage.setItem("userName", res.data.user.name || "");
      localStorage.setItem("userPhoto", res.data.user.photo || "");
    }
    return res.data;
  };

  const googleLogin = async (userData) => {
    const res = await api.post("/auth/google", {
      name: userData.name,
      email: userData.email,
      photo: userData.photo,
    });
    if (res.data.token) localStorage.setItem("token", res.data.token);
    localStorage.setItem("userEmail", userData.email);
    localStorage.setItem("userName", userData.name || "");
    localStorage.setItem("userPhoto", userData.photo || "");
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
    setUser(null);
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userPhoto");
    localStorage.removeItem("token");
  };

  const authInfo = { user, loading, login, googleLogin, logout };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;