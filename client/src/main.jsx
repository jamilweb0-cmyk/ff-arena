import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ScrollToTop from "./components/ScrollToTop"; // ✅ ইম্পোর্ট করুন
import router from "./routes/router";
import AuthProvider from "./context/AuthContext";
import "./index.css";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <ScrollToTop /> {/* ✅ এখানে যোগ করুন */}
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1a2e",
              color: "#fff",
              border: "1px solid #9333ea",
            },
          }}
        />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);