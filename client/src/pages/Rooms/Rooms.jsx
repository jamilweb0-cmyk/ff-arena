import { useEffect, useState } from "react";
import api from "../../services/axios";
import { Link } from "react-router-dom";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedMap, setSelectedMap] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const res = await api.get("/rooms", {
          params: { search, map: selectedMap, page, limit: 6 },
        });
        setRooms(res.data.data.rooms);
        setTotalPages(res.data.data.totalPages);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [search, selectedMap, page]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-purple-500"></span>
      </div>
    );
  }

  return (
    <div className="w-11/12 mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8 text-center text-purple-400">FF Arena Rooms</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search Room..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-grow p-3 rounded bg-[#1b1330] border border-purple-800 focus:outline-none focus:border-purple-500"
        />
        <select
          value={selectedMap}
          onChange={(e) => { setSelectedMap(e.target.value); setPage(1); }}
          className="p-3 rounded bg-[#1b1330] border border-purple-800 focus:outline-none focus:border-purple-500"
        >
          <option value="">All Maps</option>
          <option value="Bermuda">Bermuda</option>
          <option value="Kalahari">Kalahari</option>
          <option value="Alpine">Alpine</option>
          <option value="Nexterra">Nexterra</option>
        </select>
      </div>

      {rooms.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-3xl font-bold text-gray-400">No Rooms Found</h2>
          <Link to="/add-room">
            <button className="mt-6 bg-purple-600 px-6 py-3 rounded hover:bg-purple-700 transition">Add Room</button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div key={room._id} className="bg-[#1b1330] p-4 rounded-xl border border-purple-800 hover:scale-105 transition duration-300">
                <img src={room.image} alt={room.room_name} className="h-52 w-full object-cover rounded" />
                <h2 className="text-2xl font-bold mt-4 text-white">{room.room_name}</h2>
                <p className="text-gray-400">Map: {room.map}</p>
                <p className="text-gray-400">Mode: {room.game_mode}</p>
                <p className="text-green-400">Entry Fee: ৳{room.entry_fee}</p>
                <p className="text-yellow-400">Prize Pool: ৳{room.prize_pool}</p>
                <Link to={`/rooms/${room._id}`}>
                  <button className="mt-4 w-full bg-purple-600 p-2 rounded hover:bg-purple-700 transition">View Details</button>
                </Link>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-3 mt-10">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-4 py-2 rounded bg-purple-600 disabled:opacity-50 hover:bg-purple-700 transition">Prev</button>
            <span className="px-4 py-2 text-gray-300">{page} / {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-4 py-2 rounded bg-purple-600 disabled:opacity-50 hover:bg-purple-700 transition">Next</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Rooms;