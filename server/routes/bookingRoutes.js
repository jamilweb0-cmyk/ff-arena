const express = require("express");
const Booking = require("../models/Booking");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// CREATE BOOKING
router.post("/", verifyToken, async (req, res) => {
  try {
    const { roomId, user_email, room_name, booking_date } = req.body;
    if (user_email !== req.user.email) return res.status(403).json({ message: "Unauthorized User" });
    if (!roomId || !user_email) return res.status(400).json({ message: "Missing required fields" });

    const bookedCount = await Booking.countDocuments({ roomId });
    if (bookedCount >= 20) return res.status(400).json({ message: "Room is Fully Booked" });

    const existingBooking = await Booking.findOne({ roomId, user_email: req.user.email });
    if (existingBooking) return res.status(400).json({ message: "You already booked this room" });

    const booking = new Booking({ roomId, room_name, booking_date, user_email: req.user.email });
    await booking.save();
    res.status(201).json({ message: "Booking Successful", data: booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CHECK BOOKING
router.get("/check", async (req, res) => {
  try {
    const { roomId, email } = req.query;
    const booking = await Booking.findOne({ roomId, user_email: email });
    res.json({ alreadyBooked: !!booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET BOOKINGS BY EMAIL
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required" });
    const bookings = await Booking.find({ user_email: email });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE BOOKING
router.patch("/:id", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.user_email !== req.user.email) return res.status(403).json({ message: "Forbidden Access" });

    const updated = await Booking.findByIdAndUpdate(req.params.id, { booking_date: req.body.booking_date }, { new: true });
    res.json({ message: "Booking Updated Successfully", data: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE BOOKING (✅ এখানেই ভুলটি ছিল, এখন ঠিক করা হলো)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.user_email !== req.user.email) return res.status(403).json({ message: "Forbidden Access" });

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking Cancelled" });
  } catch (error) {
    res.status(500).json({ message: error.message }); // ✅ "server-routes-500" মুছে "500" করা হলো
  }
});

module.exports = router;