import { useEffect, useState } from "react";
import api from "../services/axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const FeaturedRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/rooms")
      .then((res) => {
        setRooms(res.data.data.rooms);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const featuredRooms = [...rooms].sort((a, b) => Number(b.prize_pool) - Number(a.prize_pool)).slice(0, 3);

  return (
    <section className="w-11/12 mx-auto py-20">
      <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-14">
        <h1 className="text-5xl font-extrabold text-purple-400">🔥 Featured Rooms</h1>
        <p className="text-gray-400 mt-4">Join the hottest Free Fire rooms and compete for amazing rewards.</p>
      </motion.div>

      {loading && (
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => <div key={item} className="animate-pulse bg-[#1b1330] h-[420px] rounded-3xl"></div>)}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {featuredRooms.map((room, index) => (
          <motion.div key={room._id} initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.2 }} viewport={{ once: true }} whileHover={{ y: -12, scale: 1.03 }} className="bg-[#1b1330] rounded-3xl overflow-hidden border border-purple-800 shadow-xl shadow-purple-900/20 transition-all duration-500">
            <div className="relative">
              <img src={room.image} alt={room.room_name} className="h-60 w-full object-cover" />
              <div className="absolute top-4 left-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">🏆 {room.prize_pool}</div>
              <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs">{room.game_mode}</div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white">{room.room_name}</h2>
              <p className="text-gray-400 mt-2">📍 {room.map}</p>
              <p className="text-gray-400">🎮 {room.game_mode}</p>
              <div className="mt-5 flex justify-between items-center">
                <span className="text-green-400 font-semibold">Entry: {room.entry_fee}</span>
                <span className="text-yellow-400 font-semibold">Prize: {room.prize_pool}</span>
              </div>
              <Link to={`/rooms/${room._id}`}>
                <button className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold hover:scale-105 transition-all duration-300">View Details 🚀</button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedRooms;