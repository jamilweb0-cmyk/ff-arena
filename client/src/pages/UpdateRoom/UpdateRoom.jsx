import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/axios";
import toast from "react-hot-toast";

const UpdateRoom = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/rooms/${id}`);
        setRoom(res.data.data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load room");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const updatedRoom = {
      room_name: form.room_name.value, map: form.map.value, game_mode: form.game_mode.value,
      entry_fee: Number(form.entry_fee.value), prize_pool: Number(form.prize_pool.value), image: form.image.value,
    };
    try {
      await api.put(`/rooms/${id}`, updatedRoom);
      toast.success("Room Updated Successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed To Update Room");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div className="min-h-screen flex justify-center items-center"><span className="loading loading-spinner loading-lg text-purple-500"></span></div>;

  const inputStyle = "w-full p-3 rounded bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700";

  return (
    <div className="w-11/12 max-w-2xl mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8 text-center text-purple-400">Update Room</h1>
      <form onSubmit={handleUpdate} className="space-y-4 bg-[#1b1330] p-6 rounded-xl border border-purple-900">
        <input name="room_name" defaultValue={room?.room_name} placeholder="Room Name" className={inputStyle} />
        <input name="map" defaultValue={room?.map} placeholder="Map" className={inputStyle} />
        <input name="game_mode" defaultValue={room?.game_mode} placeholder="Game Mode" className={inputStyle} />
        <input type="number" name="entry_fee" defaultValue={room?.entry_fee} placeholder="Entry Fee" className={inputStyle} />
        <input type="number" name="prize_pool" defaultValue={room?.prize_pool} placeholder="Prize Pool" className={inputStyle} />
        <input name="image" defaultValue={room?.image} placeholder="Image URL" className={inputStyle} />
        <button disabled={loading} className="w-full bg-purple-600 px-6 py-3 rounded font-semibold text-white hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? "Updating..." : "Update Room"}
        </button>
      </form>
    </div>
  );
};

export default UpdateRoom;