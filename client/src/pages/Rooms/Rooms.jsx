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
          params: {
            search,
            map: selectedMap,
            page,
            limit: 6,
          },
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
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="w-11/12 mx-auto py-10">

      <h1 className="text-4xl font-bold mb-8 text-center">
        FF Arena Rooms
      </h1>

      {/* SEARCH */}

      <input
        type="text"
        placeholder="Search Room..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="border p-3 rounded w-full mb-6 text-black"
      />

      {/* MAP FILTER */}

      <select
        value={selectedMap}
        onChange={(e) => {
          setSelectedMap(e.target.value);
          setPage(1);
        }}
        className="border p-3 rounded mb-6 text-black"
      >
        <option value="">All Maps</option>
        <option value="Bermuda">Bermuda</option>
        <option value="Kalahari">Kalahari</option>
        <option value="Alpine">Alpine</option>
        <option value="Nexterra">Nexterra</option>
      </select>

      {rooms.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-3xl font-bold text-gray-400">
            No Rooms Found
          </h2>

          <Link to="/add-room">
            <button className="mt-6 bg-purple-600 px-6 py-3 rounded">
              Add Room
            </button>
          </Link>
        </div>
      ) : (
        <>
          {/* ROOM GRID */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {rooms.map((room) => (
              <div
                key={room._id}
                className="bg-[#1b1330] p-4 rounded-xl hover:scale-105 transition"
              >
                <img
                  src={room.image}
                  alt={room.room_name}
                  className="h-52 w-full object-cover rounded"
                />

                <h2 className="text-2xl font-bold mt-4">
                  {room.room_name}
                </h2>

                <p>Map : {room.map}</p>

                <p>Mode : {room.game_mode}</p>

                <p>Entry Fee : ৳{room.entry_fee}</p>

                <p>Prize Pool : ৳{room.prize_pool}</p>

                <p>
  Available Slots : 20/20
</p>

                <Link to={`/rooms/${room._id}`}>
                  <button className="mt-4 w-full bg-purple-600 p-2 rounded hover:bg-purple-700">
                    View Details
                  </button>
                </Link>
              </div>
            ))}
          </div>

          {/* PAGINATION */}

          <div className="flex justify-center gap-3 mt-10">

            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="btn btn-sm"
            >
              Prev
            </button>

            <span className="px-4 py-2">
              {page} / {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="btn btn-sm"
            >
              Next
            </button>

          </div>
        </>
      )}
    </div>
  );
};

export default Rooms;