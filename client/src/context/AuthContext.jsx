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
            headers: {
              "Content-Type": "application/json",
            },
          });
          setUser(res.data);
          localStorage.setItem("userEmail", firebaseUser.email);
        } catch (error) {
          console.error("Failed to fetch user from backend:", error);
          // ✅ Fallback: Firebase user ব্যবহার করুন
          setUser({
            email: firebaseUser.email,
            name: firebaseUser.displayName || "User",
            photo: firebaseUser.photoURL || "",
            _id: firebaseUser.uid,
          });
          localStorage.setItem("userEmail", firebaseUser.email);
        }
      } else {
        setUser(null);
        localStorage.removeItem("userEmail");
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
    localStorage.setItem("userEmail", email);
    return res.data;
  };

  // ✅ Google Login ফাংশন ঠিক করুন
  const googleLogin = async (userData) => {
    try {
      const res = await api.post("/auth/google", 
        {
          name: userData.name,
          email: userData.email,
          photo: userData.photo,
        },
        { 
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      localStorage.setItem("userEmail", userData.email);
      return res.data;
    } catch (error) {
      console.error("Google Login Backend Error:", error);
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
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;