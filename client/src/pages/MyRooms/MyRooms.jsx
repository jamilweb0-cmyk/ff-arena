import { useEffect, useState } from "react";
import api from "../../services/axios";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const MyRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get("/rooms/myrooms");
        setRooms(res.data.data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load rooms");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?", text: "Room will be deleted permanently!", icon: "warning", showCancelButton: true,
      confirmButtonColor: "#9333ea", cancelButtonColor: "#ef4444", confirmButtonText: "Yes, delete it!",
    });
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/rooms/${id}`);
      setRooms((prev) => prev.filter((room) => room._id !== id));
      toast.success("Room Deleted Successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed To Delete Room");
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center"><span className="loading loading-spinner loading-lg text-purple-500"></span></div>;

  if (rooms.length === 0) {
    return (
      <div className="text-center py-24">
        <h1 className="text-4xl font-bold text-white">No Rooms Found</h1>
        <p className="text-gray-400 mt-3">You haven't created any room yet.</p>
        <Link to="/add-room"><button className="mt-6 bg-purple-600 px-6 py-3 rounded hover:bg-purple-700 transition text-white">Add Your First Room</button></Link>
      </div>
    );
  }

  return (
    <div className="w-11/12 mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6 text-purple-400">My Rooms Dashboard</h1>
      <div className="overflow-x-auto">
        <table className="table w-full bg-[#1b1330] rounded-xl">
          <thead>
            <tr className="bg-purple-700 text-white text-center">
              <th>Room Name</th><th>Mode</th><th>Entry Fee</th><th>Prize</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room._id} className="text-center text-gray-300 border-b border-purple-900">
                <td>{room.room_name}</td><td>{room.game_mode}</td><td>৳ {room.entry_fee}</td><td>৳ {room.prize_pool}</td>
                <td className="space-x-2">
                  <Link to={`/rooms/${room._id}`} className="bg-blue-500 px-3 py-1 rounded text-white hover:bg-blue-600 transition">View</Link>
                  <Link to={`/update-room/${room._id}`} className="bg-yellow-500 px-3 py-1 rounded text-white hover:bg-yellow-600 transition">Edit</Link>
                  <button onClick={() => handleDelete(room._id)} className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600 transition">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyRooms;