import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../services/axios";

const LiveCounter = () => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCount = async () => {
    try {
      const res = await api.get("/stats/live-players");
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

  return (
    <div className="w-11/12 mx-auto py-12 text-center">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center justify-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative h-3 w-3 rounded-full bg-red-600"></span>
          </span>
          <h2 className="text-2xl font-bold text-green-400">Live Players Joined</h2>
        </div>
        <p className="text-gray-400 mt-2">Real-time Free Fire room activity</p>
      </motion.div>

      <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }} whileHover={{ scale: 1.05 }} className="mt-8 inline-block px-12 py-10 bg-white/5 backdrop-blur-lg border border-purple-800 rounded-3xl shadow-xl">
        <h1 className="text-6xl font-extrabold text-purple-400">{loading ? "..." : count}</h1>
        <p className="text-gray-400 mt-3">Players Online Now</p>
      </motion.div>
    </div>
  );
};

export default LiveCounter;