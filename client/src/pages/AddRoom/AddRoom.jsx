import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/axios";

const AddRoom = () => {
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddRoom = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const roomData = {
      room_name: form.room_name.value,
      map: form.map.value,
      game_mode: form.game_mode.value,
      entry_fee: Number(form.entry_fee.value),
      prize_pool: Number(form.prize_pool.value),
      image: form.image.value,
      host_email: localStorage.getItem("userEmail"),
    };

    try {
      await api.post("/rooms", roomData);
      toast.success("Room Added Successfully");
      form.reset();
      setImagePreview("");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to Add Room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-11/12 max-w-2xl mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8 text-center text-purple-400">Add New Room</h1>
      <form onSubmit={handleAddRoom} className="space-y-4 bg-[#1b1330] p-6 rounded-xl border border-purple-800">
        <input name="room_name" placeholder="Room Name" className="w-full p-3 rounded bg-black text-white border border-gray-700 focus:border-purple-500 focus:outline-none" required />
        <select name="map" className="w-full p-3 rounded bg-black text-white border border-gray-700 focus:border-purple-500 focus:outline-none">
          <option>Bermuda</option><option>Alpine</option><option>Kalahari</option><option>Nexterra</option>
        </select>
        <select name="game_mode" className="w-full p-3 rounded bg-black text-white border border-gray-700 focus:border-purple-500 focus:outline-none">
          <option>Clash Squad</option><option>Battle Royale</option><option>Lone Wolf</option>
        </select>
        <input type="number" name="entry_fee" placeholder="Entry Fee" className="w-full p-3 rounded bg-black text-white border border-gray-700 focus:border-purple-500 focus:outline-none" required />
        <input type="number" name="prize_pool" placeholder="Prize Pool" className="w-full p-3 rounded bg-black text-white border border-gray-700 focus:border-purple-500 focus:outline-none" required />
        <input name="image" placeholder="Image URL" className="w-full p-3 rounded bg-black text-white border border-gray-700 focus:border-purple-500 focus:outline-none" onChange={(e) => setImagePreview(e.target.value)} required />
        {imagePreview && <img src={imagePreview} className="w-full h-56 object-cover rounded mt-2 border border-purple-800" alt="preview" />}
        <button disabled={loading} className="bg-purple-600 px-6 py-3 rounded w-full disabled:opacity-50 hover:bg-purple-700 transition text-white font-bold">
          {loading ? "Adding..." : "Add Room"}
        </button>
      </form>
    </div>
  );
};

export default AddRoom;