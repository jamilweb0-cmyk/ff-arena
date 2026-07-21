import { useEffect, useState } from "react";
import api from "../../services/axios";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail");
        const res = await api.get(`/bookings?email=${userEmail}`);
        setBookings(res.data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: "Cancel Booking?", text: "You won't be able to recover it!", icon: "warning", showCancelButton: true,
      confirmButtonColor: "#9333ea", cancelButtonColor: "#ef4444", confirmButtonText: "Yes, Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/bookings/${id}`);
      setBookings((prev) => prev.filter((booking) => booking._id !== id));
      toast.success("Booking Cancelled");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed To Cancel Booking");
    }
  };

  const handleUpdate = async (id) => {
    try {
      const { value: newDate } = await Swal.fire({
        title: "Update Booking Date", input: "date", inputLabel: "Select new booking date", showCancelButton: true, confirmButtonColor: "#9333ea",
      });
      if (!newDate) return;
      await api.patch(`/bookings/${id}`, { booking_date: newDate });
      setBookings((prev) => prev.map((booking) => booking._id === id ? { ...booking, booking_date: newDate } : booking));
      toast.success("Booking Updated");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed To Update Booking");
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center"><span className="loading loading-spinner loading-lg text-purple-500"></span></div>;

  if (bookings.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold text-gray-400">No Bookings Found</h2>
        <p className="text-gray-500 mt-3">You haven't booked any room yet.</p>
      </div>
    );
  }

  return (
    <div className="w-11/12 mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8 text-purple-400">My Bookings</h1>
      <div className="overflow-x-auto">
        <table className="table w-full bg-[#1b1330] rounded-xl">
          <thead>
            <tr className="bg-purple-700 text-white text-center">
              <th>Room Name</th><th>Booking Date</th><th>User Email</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="text-center text-gray-300 border-b border-purple-900">
                <td>{booking.room_name}</td><td>{booking.booking_date}</td><td>{booking.user_email}</td>
                <td><span className="bg-green-600 px-3 py-1 rounded text-white">Booked</span></td>
                <td>
                  <button onClick={() => handleUpdate(booking._id)} className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded mr-2 transition">Update</button>
                  <button onClick={() => handleCancel(booking._id)} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition">Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyBookings;