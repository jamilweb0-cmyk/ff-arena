import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const RoomCard = ({ room }) => {
  return (
    <motion.div whileHover={{ y: -10, scale: 1.03 }} transition={{ duration: 0.3 }} className="bg-[#1b1330] rounded-3xl overflow-hidden border border-purple-800 shadow-xl shadow-purple-900/20">
      <div className="relative">
        <img src={room.image} alt={room.room_name} className="h-60 w-full object-cover" />
        <div className="absolute top-4 left-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">🏆 {room.prize_pool}</div>
        <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs">{room.game_mode}</div>
      </div>
      <div className="p-5">
        <h2 className="text-2xl font-bold text-white">{room.room_name}</h2>
        <p className="text-gray-400 mt-2">📍 {room.map}</p>
        <div className="mt-4 space-y-2">
          <p className="text-green-400">💰 Entry Fee: {room.entry_fee}</p>
          <p className="text-yellow-400">🏆 Prize Pool: {room.prize_pool}</p>
        </div>
        <Link to={`/rooms/${room._id}`}>
          <button className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold hover:scale-105 transition">View Details 🚀</button>
        </Link>
      </div>
    </motion.div>
  );
};

export default RoomCard;