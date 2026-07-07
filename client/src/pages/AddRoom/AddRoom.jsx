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

      toast.error(
        error.response?.data?.message || "Failed to Add Room"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-11/12 max-w-2xl mx-auto py-10">

      <h1 className="text-4xl font-bold mb-8 text-center">
        Add New Room
      </h1>

      <form onSubmit={handleAddRoom} className="space-y-4">

        {/* Room Name */}
        <input
          name="room_name"
          placeholder="Room Name"
          className="w-full p-3 rounded bg-[#1b1330]"
          required
        />

        {/* Map */}
        <select
          name="map"
          className="w-full p-3 rounded bg-[#1b1330]"
        >
          <option>Bermuda</option>
          <option>Alpine</option>
          <option>Kalahari</option>
          <option>Nexterra</option>
        </select>

        {/* Game Mode */}
        <select
          name="game_mode"
          className="w-full p-3 rounded bg-[#1b1330]"
        >
          <option>Clash Squad</option>
          <option>Battle Royale</option>
          <option>Lone Wolf</option>
        </select>

        {/* Entry Fee */}
        <input
          type="number"
          name="entry_fee"
          placeholder="Entry Fee"
          className="w-full p-3 rounded bg-[#1b1330]"
          required
        />

        {/* Prize Pool */}
        <input
          type="number"
          name="prize_pool"
          placeholder="Prize Pool"
          className="w-full p-3 rounded bg-[#1b1330]"
          required
        />

        {/* Image */}
        <input
          name="image"
          placeholder="Image URL"
          className="w-full p-3 rounded bg-[#1b1330]"
          onChange={(e) => setImagePreview(e.target.value)}
          required
        />

        {/* Preview */}
        {imagePreview && (
          <img
            src={imagePreview}
            className="w-full h-56 object-cover rounded mt-2"
            alt="preview"
          />
        )}

        <button
          disabled={loading}
          className="bg-purple-600 px-6 py-3 rounded w-full disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Room"}
        </button>

      </form>
    </div>
  );
};

export default AddRoom;