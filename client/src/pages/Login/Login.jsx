import { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"; // ✅ শুধু Popup ইম্পোর্ট করা হয়েছে
import { auth } from "../../firebase/firebase.config";
import toast from "react-hot-toast";

const Login = () => {
  const { login, googleLogin, user, loading } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // ✅ ১. যদি ইউজার ইতিমধ্যে লগইন থাকে, তাহলে ড্যাশবোর্ডে রিডাইরেক্ট করো
  useEffect(() => {
    if (user && !loading) {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  // ✅ ২. Google Login বাটন ক্লিক হ্যান্ডলার (Popup ব্যবহার করা হয়েছে)
  const handleGoogleLogin = async () => {
    try {
      setIsProcessing(true);
      const provider = new GoogleAuthProvider();
      
      // ✅ Redirect এর বদলে Popup ব্যবহার করায় init.json 404 এরর আসবে না
      const result = await signInWithPopup(auth, provider);
      
      if (result?.user) {
        await googleLogin({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        });
        toast.success("Google Login Successful!");
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      
      // ✅ ইউজার যদি পপআপ বন্ধ করে দেয়, সেটার জন্য আলাদা মেসেজ
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error("Login cancelled by user.");
      } else {
        toast.error("Google Login Failed: " + (error.message || "Please try again"));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ ৩. Email/Password Login হ্যান্ডলার
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
          <button
            onClick={handleGoogleLogin}
            disabled={isProcessing || loading}
            className="w-full flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg border border-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing || loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </>
            )}
          </button>

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