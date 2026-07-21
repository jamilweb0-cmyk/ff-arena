import heroImage from "../assets/heroff.jpg";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-cover bg-center flex items-center overflow-hidden" style={{ backgroundImage: `url(${heroImage})` }}>
      <div className="absolute inset-0 bg-black/75"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600 opacity-20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-pink-600 opacity-20 blur-[120px] rounded-full"></div>

      <div className="relative w-11/12 mx-auto z-10">
        <div className="max-w-3xl">
          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="inline-block px-5 py-2 mb-6 rounded-full border border-purple-500 bg-purple-500/10 backdrop-blur-md">
            <span className="text-purple-300 font-semibold">🔥 #1 Free Fire Tournament Platform</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-5xl md:text-7xl font-extrabold leading-tight">
            <span className="text-white">Join Elite</span><br />
            <span className="text-purple-400">Free Fire</span><br />
            <span className="text-white">Custom Rooms</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.3 }} className="mt-8 text-lg md:text-xl text-gray-300 leading-8 max-w-2xl">
            Book custom rooms, compete against skilled players, join tournaments, and win massive prize pools every day.
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, delay: 0.5 }} className="flex flex-wrap gap-4 mt-10">
            <Link to="/rooms">
              <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold shadow-lg hover:scale-105 hover:shadow-purple-500/50 transition-all duration-300">
                Explore Rooms 🚀
              </button>
            </Link>
            <Link to="/register">
              <button className="px-8 py-4 rounded-xl border border-purple-500 text-white backdrop-blur-md hover:bg-purple-600/20 transition-all duration-300">
                Join Now
              </button>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.8, delay: 0.8 }} className="grid grid-cols-3 gap-6 mt-14">
            <div><h2 className="text-3xl font-bold text-purple-400">500+</h2><p className="text-gray-400">Active Players</p></div>
            <div><h2 className="text-3xl font-bold text-purple-400">120+</h2><p className="text-gray-400">Custom Rooms</p></div>
            <div><h2 className="text-3xl font-bold text-purple-400">৳10K+</h2><p className="text-gray-400">Prize Pool</p></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;