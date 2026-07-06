import { useState, useContext } from "react";
import api from "../../services/axios";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  // যদি Protected Route থেকে আসে
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    const form = e.target;

    const email = form.email.value;
    const password = form.password.value;

    try {

  await login(email, password);

  localStorage.setItem("userEmail", email);

  toast.success("Welcome Back!");

  form.reset();

  navigate(from, { replace: true });

}

catch (err) {

      const errorMessage =
        err.response?.data?.message ||
        "Login Failed";

      setError(errorMessage);

      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">

      <div className="w-full max-w-md bg-[#1b1330] p-8 rounded-xl">

        <h1 className="text-3xl font-bold text-center text-purple-400 mb-6">
          Login
        </h1>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="w-full p-3 mb-4 rounded bg-black"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 mb-4 rounded bg-black"
            required
          />

          <button
            className="w-full bg-purple-600 p-3 rounded hover:bg-purple-700 transition"
          >
            Login
          </button>

        </form>

        {error && (
          <p className="text-red-500 mt-4">
            {error}
          </p>
        )}

      </div>

    </div>
  );
};

export default Login;