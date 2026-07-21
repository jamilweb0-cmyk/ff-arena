import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState({});
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [alreadyBooked, setAlreadyBooked] = useState(false);
  const [relatedRooms, setRelatedRooms] = useState([]);

  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/rooms/${id}`);
        setRoom(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  useEffect(() => {
    if (!room?.map) return;
    const fetchRelated = async () => {
      try {
        const res = await api.get("/rooms", { params: { map: room.map } });
        const related = res.data.data.rooms.filter((item) => item._id !== id).slice(0, 3);
        setRelatedRooms(related);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRelated();
  }, [room?.map, id]);

  useEffect(() => {
    const checkBooking = async () => {
      if (!userEmail) return;
      try {
        const res = await api.get("/bookings/check", { params: { roomId: id, email: userEmail } });
        setAlreadyBooked(res.data.alreadyBooked);
      } catch (error) {
        console.log(error);
      }
    };
    checkBooking();
  }, [id, userEmail]);

  const handleBooking = async () => {
    if (!userEmail) { toast.error("Please Login First"); return; }
    if (bookingLoading || alreadyBooked) return;

    setBookingLoading(true);
    const bookingData = {
      roomId: room?._id,
      room_name: room?.room_name,
      user_email: userEmail,
      booking_date: new Date().toISOString().split("T")[0],
    };

    try {
      await api.post("/bookings", bookingData);
      setAlreadyBooked(true);
      toast.success("Booking Successful");
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking Failed");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-purple-500"></span>
      </div>
    );
  }

  const totalSlots = 20;
  const bookedSlots = room?.bookedCount || 0;
  const availableSlots = room?.availableSlots || (totalSlots - bookedSlots);

  return (
    <div className="w-11/12 mx-auto py-12">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <motion.div initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <img src={room?.image} className="w-full rounded-3xl border border-purple-500 shadow-2xl" alt={room?.room_name} />
        </motion.div>

        <div>
          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-bold text-white">{room?.room_name}</motion.h1>
          <p className="text-gray-400 mt-3">Elite Free Fire Custom Room</p>

          {alreadyBooked && (
            <div className="mt-4">
              <span className="bg-red-600 px-4 py-2 rounded text-white">Already Booked</span>
            </div>
          )}

          <div className="mt-6 bg-white/5 p-6 rounded-2xl border border-purple-800">
            <h3 className="text-gray-400">Prize Pool</h3>
            <h1 className="text-yellow-400 text-5xl font-bold">৳ {room?.prize_pool}</h1>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white/5 p-4 rounded-xl border border-purple-800"><p className="text-gray-400">Map</p><h3 className="text-white">{room?.map}</h3></div>
            <div className="bg-white/5 p-4 rounded-xl border border-purple-800"><p className="text-gray-400">Mode</p><h3 className="text-white">{room?.game_mode}</h3></div>
            <div className="bg-white/5 p-4 rounded-xl border border-purple-800"><p className="text-gray-400">Entry Fee</p><h3 className="text-white">৳ {room?.entry_fee}</h3></div>
            <div className="bg-white/5 p-4 rounded-xl border border-purple-800"><p className="text-gray-400">Status</p><h3 className="text-green-400">Active</h3></div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between mb-2 text-gray-300">
              <span>Available Slots</span>
              <span className="text-yellow-400 font-bold">{availableSlots}/{totalSlots}</span>
            </div>
            <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
              <div style={{ width: `${(availableSlots / totalSlots) * 100}%` }} className="h-4 rounded-full bg-gradient-to-r from-green-400 to-purple-500 transition-all duration-500"></div>
            </div>
          </div>

          <button onClick={handleBooking} disabled={bookingLoading || alreadyBooked || availableSlots === 0} className="mt-8 px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {availableSlots === 0 ? "Fully Booked" : alreadyBooked ? "Already Booked" : bookingLoading ? "Booking..." : "Book Now"}
          </button>
        </div>
      </div>

      {relatedRooms.length > 0 && (
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-8 text-purple-400">Related Rooms</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedRooms.map((r) => (
              <div key={r._id} className="bg-white/5 p-4 rounded-xl border border-purple-800 hover:scale-105 transition">
                <img src={r.image} className="h-48 w-full object-cover rounded" alt={r.room_name} />
                <h3 className="text-xl font-bold mt-2 text-white">{r.room_name}</h3>
                <p className="text-gray-400">{r.map}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetails;