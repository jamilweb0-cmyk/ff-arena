import { useEffect, useState } from "react";
import api from "../../services/axios";
import Swal from "sweetalert2";
import { showSuccess, showError } from "../../utils/toast"; // ✅ নতুন টোস্ট ইম্পোর্ট
import useScrollToTop from "../../hooks/useScrollToTop";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  useScrollToTop();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail");
        const res = await api.get(`/bookings?email=${userEmail}`);
        setBookings(res.data);
      } catch (error) {
        console.log(error);
        showError("Failed to load bookings ❌"); // ✅ আপডেট করা হয়েছে
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: "Cancel Booking?",
      text: "You won't be able to recover it!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#9333ea",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/bookings/${id}`);
      setBookings((prev) => prev.filter((booking) => booking._id !== id));
      showSuccess("Booking Cancelled Successfully! ✅"); // ✅ আপডেট করা হয়েছে
    } catch (error) {
      console.log(error);
      showError(error.response?.data?.message || "Failed To Cancel Booking ❌"); // ✅ আপডেট করা হয়েছে
    }
  };

  const handleUpdate = async (id) => {
    try {
      const { value: newDate } = await Swal.fire({
        title: "Update Booking Date",
        input: "date",
        inputLabel: "Select new booking date",
        showCancelButton: true,
        confirmButtonColor: "#9333ea",
      });
      if (!newDate) return;
      await api.patch(`/bookings/${id}`, { booking_date: newDate });
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === id ? { ...booking, booking_date: newDate } : booking
        )
      );
      showSuccess("Booking Updated Successfully! ✅"); // ✅ আপডেট করা হয়েছে
    } catch (error) {
      console.log(error);
      showError(error.response?.data?.message || "Failed To Update Booking ❌"); // ✅ আপডেট করা হয়েছে
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-purple-500"></span>
      </div>
    );

  if (bookings.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-400">No Bookings Found</h2>
        <p className="text-gray-500 mt-3">You haven't booked any room yet.</p>
      </div>
    );
  }

  return (
    <div className="w-11/12 mx-auto py-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-purple-400 text-center md:text-left">
        My Bookings
      </h1>

      {/* ✅ Desktop/Tablet View: Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table w-full bg-[#1b1330] rounded-xl">
          <thead>
            <tr className="bg-purple-700 text-white text-center">
              <th>Room Name</th>
              <th>Booking Date</th>
              <th>User Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking._id}
                className="text-center text-gray-300 border-b border-purple-900"
              >
                <td className="font-semibold">{booking.room_name}</td>
                <td>{booking.booking_date}</td>
                <td className="text-sm">{booking.user_email}</td>
                <td>
                  <span className="bg-green-600 px-3 py-1 rounded text-white text-sm">
                    Booked
                  </span>
                </td>
                <td>
                  <div className="flex justify-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleUpdate(booking._id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded transition text-sm"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleCancel(booking._id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition text-sm"
                    >
                      Cancel
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
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-[#1b1330] border border-purple-800 rounded-xl p-4 shadow-lg"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-white flex-1">{booking.room_name}</h3>
              <span className="bg-green-600 text-white text-xs px-2 py-1 rounded ml-2">
                Booked
              </span>
            </div>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between bg-white/5 p-2 rounded">
                <span className="text-gray-400">Booking Date:</span>
                <span className="text-white font-semibold">{booking.booking_date}</span>
              </div>
              <div className="flex justify-between bg-white/5 p-2 rounded">
                <span className="text-gray-400">Email:</span>
                <span className="text-white font-semibold text-xs break-all">
                  {booking.user_email}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleUpdate(booking._id)}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded transition text-sm font-semibold"
              >
                Update
              </button>
              <button
                onClick={() => handleCancel(booking._id)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded transition text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;