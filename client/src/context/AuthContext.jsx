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
          // ✅ Backend থেকে user data fetch করুন
          const res = await api.get("/auth/me", { 
            withCredentials: true,
          });
          
          if (res.data) {
            setUser(res.data);
            // ✅ localStorage-এ save করুন
            localStorage.setItem("userEmail", firebaseUser.email);
            localStorage.setItem("userName", res.data.name || firebaseUser.displayName || "");
            localStorage.setItem("userPhoto", res.data.photo || firebaseUser.photoURL || "");
          }
        } catch (error) {
          console.error("Failed to fetch user from backend:", error);
          // ✅ Fallback: localStorage থেকে data নিন
          const savedEmail = localStorage.getItem("userEmail");
          if (savedEmail) {
            setUser({
              email: savedEmail,
              name: localStorage.getItem("userName") || firebaseUser.displayName || "User",
              photo: localStorage.getItem("userPhoto") || firebaseUser.photoURL || "",
            });
          } else {
            setUser({
              email: firebaseUser.email,
              name: firebaseUser.displayName || "User",
              photo: firebaseUser.photoURL || "",
            });
            localStorage.setItem("userEmail", firebaseUser.email);
          }
        }
      } else {
        setUser(null);
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        localStorage.removeItem("userPhoto");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", 
      { email, password }, 
      { withCredentials: true }
    );
    
    if (res.data.user) {
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", res.data.user.name || "");
      localStorage.setItem("userPhoto", res.data.user.photo || "");
    }
    
    return res.data;
  };

  const googleLogin = async (userData) => {
    try {
      const res = await api.post("/auth/google", 
        {
          name: userData.name,
          email: userData.email,
          photo: userData.photo,
        },
        { withCredentials: true }
      );
      
      localStorage.setItem("userEmail", userData.email);
      localStorage.setItem("userName", userData.name || "");
      localStorage.setItem("userPhoto", userData.photo || "");
      
      return res.data;
    } catch (error) {
      console.error("Google Login Backend Error:", error);
      // ✅ Backend fail হলেও localStorage-এ save করুন
      localStorage.setItem("userEmail", userData.email);
      localStorage.setItem("userName", userData.name || "");
      localStorage.setItem("userPhoto", userData.photo || "");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
    setUser(null);
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userPhoto");
  };

  const authInfo = {
    user,
    loading,
    login,
    googleLogin,
    logout,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;