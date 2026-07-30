import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/axios";
import toast from "react-hot-toast";
import useScrollToTop from "../../hooks/useScrollToTop";

const UpdateRoom = () => {
  useScrollToTop();
  const { id } = useParams();
  const navigate = useNavigate();
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
    setImageError(false); // নতুন লিংক দিলে এরর রিসেট হবে
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

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-purple-500"></span>
      </div>
    );
  }

  // ✅ মোবাইল ফ্রেন্ডলি ইনপুট স্টাইল
  const inputStyle = "w-full p-4 rounded bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700 text-base";

  return (
    <div className="w-11/12 max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-purple-400">
        Update Room
      </h1>
      <form
        onSubmit={handleUpdate}
        className="space-y-5 bg-[#1b1330] p-5 md:p-6 rounded-xl border border-purple-800"
      >
        {/* Room Name */}
        <input
          name="room_name"
          defaultValue={room?.room_name}
          placeholder="Room Name (e.g., Championship Finals)"
          className={inputStyle}
          required
        />

        {/* Map */}
        <select
          name="map"
          defaultValue={room?.map}
          className={`${inputStyle} appearance-none`}
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
          className={`${inputStyle} appearance-none`}
          required
        >
          <option value="Clash Squad">Clash Squad</option>
          <option value="Battle Royale">Battle Royale</option>
          <option value="Lone Wolf">Lone Wolf</option>
        </select>

        {/* Entry Fee & Prize Pool (Side by Side on mobile) */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="entry_fee"
            defaultValue={room?.entry_fee}
            placeholder="Entry Fee (৳)"
            min="0"
            className={inputStyle}
            required
          />
          <input
            type="number"
            name="prize_pool"
            defaultValue={room?.prize_pool}
            placeholder="Prize Pool (৳)"
            min="0"
            className={inputStyle}
            required
          />
        </div>

        {/* Image URL - Mobile Optimized */}
        <div>
          <input
            type="text"
            inputMode="url" /* ✅ মোবাইলে URL কিবোর্ড এবং Paste অপশন সহজে আনবে */
            name="image"
            defaultValue={room?.image}
            placeholder="এখানে যেকোনো ইমেজের লিংক পেস্ট করুন..."
            className={`${inputStyle} break-all`}
            onChange={handleImageChange}
            required
          />
          {/* ✅ মোবাইল ফ্রেন্ডলি টিপস */}
          <p className="text-xs text-gray-400 mt-2 flex items-start gap-1">
            <span>💡</span> 
            <span>Facebook, Imgur বা যেকোনো সাইট থেকে ইমেজের লিংক কপি করে সরাসরি এখানে পেস্ট করুন।</span>
          </p>
        </div>

        {/* ✅ স্মার্ট ইমেজ প্রিভিউ */}
        {imagePreview && (
          <div className="mt-3 relative rounded-lg overflow-hidden border border-purple-800">
            <img
              src={imagePreview}
              className={`w-full h-48 md:h-56 object-cover transition-opacity duration-300 ${
                imageError ? "opacity-40" : "opacity-100"
              }`}
              alt="Room preview"
              onError={handleImageError}
              loading="lazy"
            />
            {/* যদি প্রিভিউ না আসে, তবুও ইউজারকে ভয় দেখানো হবে না */}
            {imageError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 p-4">
                <p className="text-yellow-400 font-semibold text-sm mb-1">⚠️ প্রিভিউ লোড হচ্ছে না</p>
                <p className="text-gray-300 text-xs text-center">
                  লিংকটি সরাসরি ইমেজ ফাইল নাও হতে পারে।<br/>
                  তবুও লিংকটি সঠিক হলে আপডেট করতে কোনো সমস্যা নেই।
                </p>
              </div>
            )}
          </div>
        )}

        {/* প্রি-সেট ইমেজ অপশন */}
        <div>
          <p className="text-sm text-gray-400 mb-3 font-medium">
            অথবা নিচের যেকোনো একটি ইমেজ সিলেক্ট করুন (ট্যাপ করুন):
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {presetImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  document.querySelector('input[name="image"]').value = img;
                  setImagePreview(img);
                  setImageError(false);
                }}
                className="border-2 border-gray-700 rounded-lg overflow-hidden hover:border-purple-500 transition active:scale-95"
              >
                <img
                  src={img}
                  alt={`Preset ${idx + 1}`}
                  className="w-full h-24 object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button - Mobile Friendly Size */}
        <button
          disabled={loading}
          className="w-full bg-purple-600 p-4 rounded-lg font-bold text-white text-lg shadow-lg hover:bg-purple-700 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="loading loading-spinner loading-sm"></span>
              Updating Room...
            </span>
          ) : (
            "Update Room"
          )}
        </button>
      </form>
    </div>
  );
};

export default UpdateRoom;