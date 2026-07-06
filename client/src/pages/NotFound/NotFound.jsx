import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#0f0a1a] text-white">

      <motion.h1
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-8xl font-extrabold text-purple-500"
      >
        404
      </motion.h1>

      <p className="text-gray-400 mt-4 text-xl">
        Page Not Found
      </p>

      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
      >
        Go Home
      </Link>

    </div>
  );
};

export default NotFound;