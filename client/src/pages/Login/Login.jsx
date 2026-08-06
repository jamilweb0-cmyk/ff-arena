import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { showSuccess, showError } from "../../utils/toast";
import useScrollToTop from "../../hooks/useScrollToTop"; // ✅ এই লাইনটি যোগ করুন

const Login = () => {
  useScrollToTop(); // ✅ এই লাইনটি যোগ করুন (সবচেয়ে উপরে)
  
  const { login, googleLogin, user, loading } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // ✅ Google Login Success Handler
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsProcessing(true);
      
      const decoded = jwtDecode(credentialResponse.credential);
      
      console.log("Google Profile Photo:", decoded.picture);
      console.log("Google Profile Data:", decoded);
      
      await googleLogin({
        name: decoded.name,
        email: decoded.email,
        photo: decoded.picture,
        googleId: decoded.sub,
      });
      
      showSuccess("Google Login Successful! 🎮");
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Google Login Error:", error);
      showError("Google Login Failed: " + (error.message || "Please try again"));
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ Google Login Error Handler
  const handleGoogleError = () => {
    showError("Google Login Failed. Please try again.");
    setIsProcessing(false);
  };

  // ✅ Email/Password Login Handler
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      setIsProcessing(true);
      await login(formData.email, formData.password);
      showSuccess("Login Successful! Welcome back.");
      navigate(from, { replace: true });
    } catch (error) {
      showError(error.response?.data?.message || "Invalid email or password ❌");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#0f0a18] via-[#1a0f2e] to-[#0f0a18]">
      <div className="max-w-md w-full">
        {/* ✅ Card with Glow Effect */}
        <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-purple-500/30">
          {/* Top Glow */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full blur-md"></div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-400 text-sm">Login to access your FF Arena account</p>
          </div>

          {/* Google Login Button */}
          <div className="mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="filled_black"
              size="large"
              text="signin_with"
              shape="rectangular"
              width="100%"
            />
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-gray-900 text-gray-500">OR CONTINUE WITH</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3.5 bg-black/50 border border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white placeholder-gray-500 transition-all"
                required
              />
            </div>

            {/* ✅ Password Field with Eye Toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3.5 pr-12 bg-black/50 border border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white placeholder-gray-500 transition-all"
                required
              />
              {/* ✅ Eye Icon Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing || loading}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transform hover:-translate-y-0.5"
            >
              {isProcessing || loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="loading loading-spinner loading-sm"></span>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4 transition-colors"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;