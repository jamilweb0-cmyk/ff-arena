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
      {/* ✅ ডেস্কটপ: বাম পাশে বেশি ডার্ক (টেক্সটের জন্য), ডান পাশে কম (ক্যারেক্টারের জন্য) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/15 hidden md:block"></div>
      
      {/* ✅ মোবাইল: ডান পাশে বেশি ডার্ক (টেক্সট ডান দিকে যাবে) */}
      <div className="absolute inset-0 bg-gradient-to-l from-black/85 via-black/60 to-black/20 md:hidden"></div>
      
      {/* গ্লো ইফেক্ট */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600 opacity-10 blur-[120px] rounded-full hidden md:block"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-pink-600 opacity-10 blur-[120px] rounded-full hidden md:block"></div>

      <div className="relative w-11/12 mx-auto z-10">
        {/* ✅ ডেস্কটপে বাম দিকে, মোবাইলে ডান দিকে */}
        <div className="max-w-3xl md:mr-auto mr-0 md:ml-0 ml-auto">
          
          {/* ✅ প্রফেশনাল ব্যাজ */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex justify-end md:justify-start mb-6"
            >
              <div className="relative group">
                {/* গ্লো ইফেক্ট */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 rounded-full opacity-75 blur group-hover:opacity-100 transition duration-500"></div>
                
                {/* মূল ব্যাজ */}
                <div className="relative flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#1a0f2e] to-[#2d1b4e] border border-purple-500/50 backdrop-blur-md">
                  {/* পালসিং ডট */}
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-sm font-semibold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                    Free Fire Tournament Platform
                  </span>
                </div>
              </div>
            </motion.div>

          {/* হেডিং - ডেস্কটপে বাম, মোবাইলে ডান */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight md:text-left text-right"
          >
            <span className="text-white drop-shadow-lg">Join Elite</span>
            <br />
            <span className="text-purple-400 drop-shadow-lg">Free Fire</span>
            <br />
            <span className="text-white drop-shadow-lg">Custom Rooms</span>
          </motion.h1>

          {/* প্যারাগ্রাফ - ডেস্কটপে বাম, মোবাইলে ডান */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="mt-8 text-base sm:text-lg md:text-xl text-gray-200 leading-8 drop-shadow-md md:text-left text-right"
          >
            Book custom rooms, compete against skilled players, join tournaments,
            and win massive prize pools every day.
          </motion.p>

          {/* বাটন - ডেস্কটপে বাম, মোবাইলে ডান */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="flex flex-wrap gap-4 mt-10 md:justify-start justify-end"
          >
            <Link to="/rooms">
              <button className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold shadow-lg hover:scale-105 hover:shadow-purple-500/50 transition-all duration-300">
                Explore Rooms 🚀
              </button>
            </Link>

            <Link to={user ? "/rooms" : "/register"}>
              <button className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl border border-purple-500 text-white backdrop-blur-md hover:bg-purple-600/20 transition-all duration-300">
                {user 
                  ? `Play Now, ${getFirstName(user.name)} ` 
                  : "Join Now"
                }
              </button>
            </Link>
          </motion.div>

          {/* স্ট্যাটস */}
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