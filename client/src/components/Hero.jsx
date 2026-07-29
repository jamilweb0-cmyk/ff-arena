import heroImage from "../assets/hazard.jpg";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Hero = () => {
  const { user } = useContext(AuthContext);

  const getFirstName = (fullName) => {
    if (!fullName) return "Player";
    return fullName.split(" ")[0];
  };

  return (
    <div 
      className="relative min-h-screen bg-cover bg-center bg-no-repeat flex items-center overflow-hidden"
      style={{ 
        backgroundImage: `url(${heroImage})`,
        backgroundPosition: "center right", // ✅ ক্যারেক্টার ডান দিকে
      }}
    >
      {/* ✅ ডেস্কটপ: বাম পাশে বেশি ডার্ক, ডান পাশে ১৫% ওভারলে */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/15 hidden md:block"></div>
      
      {/* ✅ মোবাইল: কম ওভারলে (60%) যাতে ক্যারেক্টার দেখা যায় */}
      <div className="absolute inset-0 bg-black/60 md:hidden"></div>
      
      {/* গ্লো ইফেক্ট */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600 opacity-10 blur-[120px] rounded-full hidden md:block"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-pink-600 opacity-10 blur-[120px] rounded-full hidden md:block"></div>

      <div className="relative w-11/12 mx-auto z-10">
        {/* ✅ সবসময় বাম দিকে (মোবাইল ও ডেস্কটপ) */}
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block px-5 py-2 mb-6 rounded-full border border-purple-500 bg-purple-500/10 backdrop-blur-md"
          >
            <span className="text-purple-300 font-semibold text-shadow">
              🔥 #1 Free Fire Tournament Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight text-left"
          >
            <span className="text-white drop-shadow-lg">Join Elite</span>
            <br />
            <span className="text-purple-400 drop-shadow-lg">Free Fire</span>
            <br />
            <span className="text-white drop-shadow-lg">Custom Rooms</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="mt-8 text-base sm:text-lg md:text-xl text-gray-200 leading-8 max-w-2xl drop-shadow-md"
          >
            Book custom rooms, compete against skilled players, join tournaments,
            and win massive prize pools every day.
          </motion.p>

          {/* ✅ বাটন বাম দিকে */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="flex flex-wrap gap-4 mt-10"
          >
            <Link to="/rooms">
              <button className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold shadow-lg hover:scale-105 hover:shadow-purple-500/50 transition-all duration-300">
                Explore Rooms 🚀
              </button>
            </Link>

            <Link to={user ? "/rooms" : "/register"}>
              <button className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl border border-purple-500 text-white backdrop-blur-md hover:bg-purple-600/20 transition-all duration-300">
                {user 
                  ? `Play Now, ${getFirstName(user.name)} 🎮` 
                  : "Join Now"
                }
              </button>
            </Link>
          </motion.div>

          {/* ✅ স্ট্যাটস বাম দিকে */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.8, delay: 0.8 }}
            className="grid grid-cols-3 gap-4 sm:gap-6 mt-10 sm:mt-14"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-purple-400">500+</h2>
              <p className="text-gray-300 text-xs sm:text-sm">Active Players</p>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-purple-400">120+</h2>
              <p className="text-gray-300 text-xs sm:text-sm">Custom Rooms</p>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-purple-400">10K+</h2>
              <p className="text-gray-300 text-xs sm:text-sm">Prize Pool</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;