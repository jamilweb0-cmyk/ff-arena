import { createContext, useState, useEffect } from "react";
import api from "../services/axios";

export const AuthContext = createContext(null);

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ অ্যাপ লোড হওয়ার সময় localStorage থেকে token চেক করুন
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      
      if (token) {
        try {
          // ✅ Token থাকলে backend থেকে user data fetch করুন
          const res = await api.get("/auth/me");
          if (res.data) {
            setUser(res.data);
            // ✅ Photo সহ সব তথ্য localStorage-এ সেভ করুন
            localStorage.setItem("userEmail", res.data.email);
            localStorage.setItem("userName", res.data.name || "");
            localStorage.setItem("userPhoto", res.data.photo || "");
          }
        } catch (error) {
          console.error("Token validation failed:", error);
          // ✅ Token invalid হলে মুছে ফেলুন
          localStorage.removeItem("token");
          localStorage.removeItem("userEmail");
          localStorage.removeItem("userName");
          localStorage.removeItem("userPhoto");
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

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
      console.log("📸 Received photo from Google:", userData.photo); // ✅ Debug
      
      const res = await api.post("/auth/google", {
        name: userData.name,
        email: userData.email,
        photo: userData.photo, // ✅ Photo backend-এ পাঠানো
        googleId: userData.googleId || "",
      });
      
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        console.log("✅ Token saved:", res.data.token);
      }
      
      // ✅ Photo সহ সব তথ্য localStorage-এ সেভ করুন
      localStorage.setItem("userEmail", userData.email);
      localStorage.setItem("userName", userData.name || "");
      localStorage.setItem("userPhoto", userData.photo || ""); // ✅ Photo save
      
      // ✅ user অবজেক্টে photo সেট করুন
      const userWithPhoto = res.data.user || {
        email: userData.email,
        name: userData.name,
        photo: userData.photo, // ✅ এখানে photo সেট করুন
      };
      
      // ✅ যদি backend থেকে photo না আসে, তাহলে userData থেকে নিন
      if (!userWithPhoto.photo && userData.photo) {
        userWithPhoto.photo = userData.photo;
      }
      
      console.log("✅ Setting user with photo:", userWithPhoto); // ✅ Debug
      setUser(userWithPhoto);
      
      return res.data;
    } catch (error) {
      console.error("Google Login Error:", error);
      throw error;
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