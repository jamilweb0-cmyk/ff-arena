import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/axios";
import toast from "react-hot-toast";
import useScrollToTop from "../../hooks/useScrollToTop";

const UpdateRoom = () => {
  useScrollToTop();
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ নেভিগেট হুক
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  
  // ✅ ইমেজ স্টেট
  const [imagePreview, setImagePreview] = useState("");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/rooms/${id}`);
        const roomData = res.data.data;
        setRoom(roomData);
        setImagePreview(roomData.image); // ✅ বর্তমান ইমেজ প্রিভিউতে সেট
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
      room_name: form.room_name.value,
      map: form.map.value,
      game_mode: form.game_mode.value,
      entry_fee: Number(form.entry_fee.value),
      prize_pool: Number(form.prize_pool.value),
      image: form.image.value,
    };
    try {
      await api.put(`/rooms/${id}`, updatedRoom);
      toast.success("Room Updated Successfully");
      
      // ✅ সফল হলে My Rooms পেজে রিডাইরেক্ট করো
      navigate("/my-rooms");
      
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed To Update Room");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const url = e.target.value;
    setImagePreview(url);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // ✅ প্রি-সেট ইমেজ অপশন
  const presetImages = [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600",
    "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600",
    "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600",
  ];

  if (fetchLoading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-purple-500"></span>
      </div>
    );

  const inputStyle =
    "w-full p-3 rounded bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700";

  return (
    <div className="w-11/12 max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-purple-400">
        Update Room
      </h1>
      <form
        onSubmit={handleUpdate}
        className="space-y-4 bg-[#1b1330] p-6 rounded-xl border border-purple-900"
      >
        {/* Room Name */}
        <input
          name="room_name"
          defaultValue={room?.room_name}
          placeholder="Room Name (e.g., Championship Finals 2026)"
          className={inputStyle}
          required
        />

        {/* Map */}
        <select
          name="map"
          defaultValue={room?.map}
          className={inputStyle}
          required
        >
          <option value="Bermuda">Bermuda</option>
          <option value="Alpine">Alpine</option>
          <option value="Kalahari">Kalahari</option>
          <option value="Nexterra">Nexterra</option>
        </select>

        {/* Game Mode */}
        <select
          name="game_mode"
          defaultValue={room?.game_mode}
          className={inputStyle}
          required
        >
          <option value="Clash Squad">Clash Squad</option>
          <option value="Battle Royale">Battle Royale</option>
          <option value="Lone Wolf">Lone Wolf</option>
        </select>

        {/* Entry Fee */}
        <input
          type="number"
          name="entry_fee"
          defaultValue={room?.entry_fee}
          placeholder="Entry Fee (e.g., 50, 100)"
          min="0"
          className={inputStyle}
          required
        />

        {/* Prize Pool */}
        <input
          type="number"
          name="prize_pool"
          defaultValue={room?.prize_pool}
          placeholder="Prize Pool (e.g., 5000, 10000)"
          min="0"
          className={inputStyle}
          required
        />

        {/* Image URL */}
        <div>
          <input
            name="image"
            defaultValue={room?.image}
            placeholder="Image URL (e.g., https://example.com/image.jpg)"
            className={inputStyle}
            onChange={handleImageChange}
            required
          />
          {/* ✅ হেল্প টেক্সট */}
          <p className="text-xs text-gray-400 mt-2">
             টিপস: সরাসরি ইমেজ URL দিন (.jpg, .png, .webp দিয়ে শেষ হওয়া)। 
            ওয়েবসাইটের URL কাজ করবে না।
          </p>
          <p className="text-xs text-gray-500 mt-1">
            উদাহরণ: https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600
          </p>
        </div>

        {/* ✅ ইমেজ প্রিভিউ */}
        {imagePreview && (
          <div className="mt-2">
            {imageError ? (
              <div className="w-full h-56 bg-gray-800 rounded border border-red-500 flex items-center justify-center">
                <div className="text-center p-4">
                  <p className="text-red-400 font-semibold mb-2">❌ ইমেজ লোড হয়নি</p>
                  <p className="text-gray-400 text-xs">
                    URL টি সরাসরি ইমেজ ফাইল নয়। অন্য URL চেষ্টা করুন।
                  </p>
                </div>
              </div>
            ) : (
              <img
                src={imagePreview}
                className="w-full h-56 object-cover rounded border border-purple-800"
                alt="Room preview"
                onError={handleImageError}
              />
            )}
          </div>
        )}

        {/* ✅ প্রি-সেট ইমেজ অপশন */}
        <div>
          <p className="text-sm text-gray-400 mb-2">
            অথবা নিচের যেকোনো একটি ইমেজ ব্যবহার করুন:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {presetImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  document.querySelector('input[name="image"]').value = img;
                  setImagePreview(img);
                  setImageError(false);
                }}
                className="border border-gray-700 rounded overflow-hidden hover:border-purple-500 transition"
              >
                <img
                  src={img}
                  alt={`Preset ${idx + 1}`}
                  className="w-full h-20 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          disabled={loading}
          className="w-full bg-purple-600 px-6 py-3 rounded font-semibold text-white hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Updating..." : "Update Room"}
        </button>
      </form>
    </div>
  );
};

export default UpdateRoom;