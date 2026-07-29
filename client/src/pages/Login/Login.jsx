import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import useScrollToTop from "../../hooks/useScrollToTop";

const Login = () => {
  useScrollToTop();
  const { login, googleLogin, user, loading } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // ✅ Google Login Success Handler
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsProcessing(true);
      
      // ✅ Google Token decode করুন
      const decoded = jwtDecode(credentialResponse.credential);
      
      // ✅ Backend-এ পাঠান
      await googleLogin({
        name: decoded.name,
        email: decoded.email,
        photo: decoded.picture,
        googleId: decoded.sub,
      });
      
      toast.success("Google Login Successful!");
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Google Login Error:", error);
      toast.error("Google Login Failed: " + (error.message || "Please try again"));
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ Google Login Error Handler
  const handleGoogleError = () => {
    toast.error("Google Login Failed. Please try again.");
    setIsProcessing(false);
  };

  // ✅ Email/Password Login Handler
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      setIsProcessing(true);
      await login(formData.email, formData.password);
      toast.success("Login Successful!");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-gray-900 rounded-lg shadow-xl p-8 border border-purple-500/30">
          <h2 className="text-3xl font-bold text-center text-purple-400 mb-8">Login</h2>

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
              width={300}
            />
          </div>

          <div className="my-6 text-center">
            <span className="text-gray-500">OR</span>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-500"
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing || loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing || loading ? <span className="loading loading-spinner loading-sm"></span> : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-purple-400 hover:text-purple-300 underline font-semibold"
              >
                Register
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;