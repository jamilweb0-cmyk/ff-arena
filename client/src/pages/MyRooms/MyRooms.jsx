import { useEffect, useState } from "react";
import api from "../../services/axios";
import Swal from "sweetalert2";
import { showSuccess, showError } from "../../utils/toast"; // ✅ নতুন টোস্ট ইম্পোর্ট
import { Link } from "react-router-dom";
import useScrollToTop from "../../hooks/useScrollToTop";

const MyRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useScrollToTop();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get("/rooms/myrooms");
        setRooms(res.data.data);
      } catch (error) {
        console.log(error);
        showError("Failed to load rooms ❌"); // ✅ আপডেট করা হয়েছে
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Room will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#9333ea",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
    });
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/rooms/${id}`);
      setRooms((prev) => prev.filter((room) => room._id !== id));
      showSuccess("Room Deleted Successfully! 🗑️"); // ✅ আপডেট করা হয়েছে
    } catch (error) {
      console.log(error);
      showError(error.response?.data?.message || "Failed To Delete Room ❌"); // ✅ আপডেট করা হয়েছে
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-purple-500"></span>
      </div>
    );

  if (rooms.length === 0) {
    return (
      <div className="text-center py-24 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white">No Rooms Found</h1>
        <p className="text-gray-400 mt-3">You haven't created any room yet.</p>
        <Link to="/add-room">
          <button className="mt-6 bg-purple-600 px-6 py-3 rounded hover:bg-purple-700 transition text-white">
            Add Your First Room
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-11/12 mx-auto py-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-purple-400 text-center md:text-left">
        My Rooms Dashboard
      </h1>

      {/* ✅ Desktop/Tablet View: Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table w-full bg-[#1b1330] rounded-xl">
          <thead>
            <tr className="bg-purple-700 text-white text-center">
              <th>Room Name</th>
              <th>Mode</th>
              <th>Entry Fee</th>
              <th>Prize</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room._id} className="text-center text-gray-300 border-b border-purple-900">
                <td className="font-semibold">{room.room_name}</td>
                <td>{room.game_mode}</td>
                <td>৳ {room.entry_fee}</td>
                <td>৳ {room.prize_pool}</td>
                <td>
                  <div className="flex justify-center gap-2 flex-wrap">
                    <Link
                      to={`/rooms/${room._id}`}
                      className="bg-blue-500 px-3 py-1 rounded text-white hover:bg-blue-600 transition text-sm"
                    >
                      View
                    </Link>
                    <Link
                      to={`/update-room/${room._id}`}
                      className="bg-yellow-500 px-3 py-1 rounded text-white hover:bg-yellow-600 transition text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(room._id)}
                      className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600 transition text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Mobile View: Card Layout */}
      <div className="md:hidden space-y-4">
        {rooms.map((room) => (
          <div
            key={room._id}
            className="bg-[#1b1330] border border-purple-800 rounded-xl p-4 shadow-lg"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-white flex-1">{room.room_name}</h3>
              <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded ml-2">
                {room.game_mode}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div className="bg-white/5 p-2 rounded">
                <p className="text-gray-400 text-xs">Entry Fee</p>
                <p className="text-green-400 font-semibold">৳ {room.entry_fee}</p>
              </div>
              <div className="bg-white/5 p-2 rounded">
                <p className="text-gray-400 text-xs">Prize Pool</p>
                <p className="text-yellow-400 font-semibold">৳ {room.prize_pool}</p>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Link
                to={`/rooms/${room._id}`}
                className="flex-1 bg-blue-500 px-3 py-2 rounded text-white text-center text-sm hover:bg-blue-600 transition"
              >
                View
              </Link>
              <Link
                to={`/update-room/${room._id}`}
                className="flex-1 bg-yellow-500 px-3 py-2 rounded text-white text-center text-sm hover:bg-yellow-600 transition"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(room._id)}
                className="flex-1 bg-red-500 px-3 py-2 rounded text-white text-sm hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRooms;