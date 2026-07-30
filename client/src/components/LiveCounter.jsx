import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaTrophy, FaGamepad } from "react-icons/fa";
import api from "../services/axios";

const LiveCounter = () => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [previousCount, setPreviousCount] = useState(0);

  const fetchCount = async () => {
    try {
      const res = await api.get("/stats/live-players");
      setPreviousCount(count);
      setCount(res.data.count);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCount();
    const interval = setInterval(() => { fetchCount(); }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Calculate change percentage
  const change = count - previousCount;
  const isIncreasing = change > 0;

  return (
    <div className="w-11/12 mx-auto py-16">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        {/* Live Badge */}
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/30 backdrop-blur-md mb-6">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="text-red-400 font-bold text-sm uppercase tracking-wider">Live Activity</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
          Real-Time Player Stats
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Track live Free Fire tournament activity and player engagement
        </p>
      </motion.div>

      {/* Main Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        
        {/* Live Players Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          whileHover={{ y: -5 }}
          className="relative group"
        >
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
          
          <div className="relative bg-gradient-to-br from-[#1a0f2e] to-[#2d1b4e] border border-purple-500/30 rounded-2xl p-8 text-center backdrop-blur-md">
            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <FaUsers className="text-3xl text-white" />
            </div>

            {/* Count */}
            <div className="relative">
              <motion.h1 
                key={count}
                initial={{ scale: 1.2, color: "#fbbf24" }}
                animate={{ scale: 1, color: "#c084fc" }}
                transition={{ duration: 0.3 }}
                className="text-5xl font-extrabold text-purple-400 mb-2"
              >
                {loading ? (
                  <span className="inline-block w-20 h-12 bg-purple-500/20 rounded animate-pulse"></span>
                ) : (
                  count.toLocaleString()
                )}
              </motion.h1>
              
              {/* Change Indicator */}
              {!loading && change !== 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center justify-center gap-1 text-sm font-semibold ${isIncreasing ? 'text-green-400' : 'text-red-400'}`}
                >
                  {isIncreasing ? '↑' : '↓'} {Math.abs(change)} {isIncreasing ? 'joined' : 'left'}
                </motion.div>
              )}
            </div>

            <p className="text-gray-400 mt-4 font-medium">Players Online</p>
            
            {/* Live Indicator */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-gray-500">Updated live</span>
            </div>
          </div>
        </motion.div>

        {/* Active Rooms Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          whileHover={{ y: -5 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
          
          <div className="relative bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-blue-500/30 rounded-2xl p-8 text-center backdrop-blur-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <FaGamepad className="text-3xl text-white" />
            </div>

            <h1 className="text-5xl font-extrabold text-blue-400 mb-2">
              {loading ? (
                <span className="inline-block w-20 h-12 bg-blue-500/20 rounded animate-pulse"></span>
              ) : (
                Math.floor(count / 10).toLocaleString()
              )}
            </h1>

            <p className="text-gray-400 mt-4 font-medium">Active Rooms</p>
            
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-xs text-gray-500">Running now</span>
            </div>
          </div>
        </motion.div>

        {/* Total Prize Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          whileHover={{ y: -5 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
          
          <div className="relative bg-gradient-to-br from-[#1a0f2e] to-[#2d1b4e] border border-yellow-500/30 rounded-2xl p-8 text-center backdrop-blur-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <FaTrophy className="text-3xl text-white" />
            </div>

            <h1 className="text-5xl font-extrabold text-yellow-400 mb-2">
              {loading ? (
                <span className="inline-block w-20 h-12 bg-yellow-500/20 rounded animate-pulse"></span>
              ) : (
                `৳${(count * 50).toLocaleString()}`
              )}
            </h1>

            <p className="text-gray-400 mt-4 font-medium">Prize Pool</p>
            
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
              <span className="text-xs text-gray-500">Growing</span>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Bottom Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="mt-12 text-center"
      >
        <div className="inline-flex flex-wrap items-center justify-center gap-6 px-8 py-4 rounded-full bg-white/5 border border-purple-500/20 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-gray-300 text-sm">Server Status:</span>
            <span className="text-green-400 font-semibold text-sm">Online</span>
          </div>
          <span className="text-purple-500">|</span>
          <div className="text-gray-400 text-sm">
            Last updated: <span className="text-purple-400">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LiveCounter;