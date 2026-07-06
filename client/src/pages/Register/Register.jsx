import { useState } from "react";
import api from "../../services/axios";
import toast from "react-hot-toast";

const Register = () => {
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    const form = e.target;

    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;

    const userData = {
      name,
      email,
      password,
    };

    try {
      const res = await api.post("/auth/register", userData);

      toast.success("Account Created Successfully");

      form.reset();

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Registration Failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">

      <div className="w-full max-w-md bg-[#1b1330] p-8 rounded-xl">

        <h1 className="text-3xl font-bold text-center text-purple-400 mb-6">
          Register
        </h1>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="w-full p-3 mb-4 rounded bg-black"
            required
          />

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
            className="w-full bg-purple-600 p-3 rounded"
          >
            Register
          </button>

        </form>

        {
          error && (
            <p className="text-red-500 mt-4">
              {error}
            </p>
          )
        }

      </div>

    </div>
  );
};

export default Register;