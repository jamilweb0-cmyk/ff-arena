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
          // ✅ কুকি সহ ব্যাকএন্ড থেকে ইউজার ডেটা আনা হচ্ছে
          const res = await api.get("/auth/me", { withCredentials: true });
          setUser(res.data);
        } catch (error) {
          console.warn("Backend /me failed, using Firebase user as fallback", error);
          // ✅ ব্যাকএন্ড কুকি যদি একটু লেট করে, তবুও ইউজারকে লগইন দেখানো হবে
          setUser({
            email: firebaseUser.email,
            name: firebaseUser.displayName || "User",
            photo: firebaseUser.photoURL || "",
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false); // ✅ ডেটা লোড শেষ হলেই লোডিং বন্ধ হবে
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password }, { withCredentials: true });
    return res.data;
  };

  const googleLogin = async (firebaseUser) => {
    const res = await api.post(
      "/auth/google",
      {
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        photo: firebaseUser.photoURL,
      },
      { withCredentials: true }
    );
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
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
      {/* ✅ লোডিং শেষ না হওয়া পর্যন্ত children রেন্ডার হবে না (রিফ্রেশে লগআউট ভাব দেখাবে না) */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;