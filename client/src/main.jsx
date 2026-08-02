import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import router from "./routes/router";
import AuthProvider from "./context/AuthContext";
import "./index.css";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <RouterProvider router={router} />
        
        {/* ✅ Professional Toast Configuration */}
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              background: "rgba(18, 12, 31, 0.95)",
              color: "#fff",
              border: "1px solid rgba(147, 51, 234, 0.3)",
              borderRadius: "12px",
              padding: "16px 20px",
              fontSize: "14px",
              fontWeight: "500",
              boxShadow: "0 10px 40px rgba(147, 51, 234, 0.2)",
              backdropFilter: "blur(10px)",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
              style: {
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
              style: {
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
              },
            },
            loading: {
              iconTheme: {
                primary: "#a855f7",
                secondary: "#fff",
              },
            },
          }}
          containerStyle={{
            top: 80,
          }}
        />
        
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);