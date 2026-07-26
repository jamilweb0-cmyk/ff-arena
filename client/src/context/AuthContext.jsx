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
        // ✅ Firebase user থেকে backend user fetch করুন
        try {
          const res = await api.get("/auth/me");
          setUser(res.data);
          localStorage.setItem("userEmail", firebaseUser.email);
        } catch (error) {
          console.error("Failed to fetch user:", error);
          setUser(null);
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
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("userEmail", email);
    return res.data;
  };

  const googleLogin = async (firebaseUser) => {
    const res = await api.post("/auth/google", {
      name: firebaseUser.displayName,
      email: firebaseUser.email,
      photo: firebaseUser.photoURL,
    });
    localStorage.setItem("userEmail", firebaseUser.email);
    return res.data;
  };

  const logout = async () => {
    await api.post("/auth/logout");
    localStorage.removeItem("userEmail");
    setUser(null);
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