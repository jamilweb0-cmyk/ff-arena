const express = require("express");
const Booking = require("../models/Booking");

const router = express.Router();

router.get("/live-players", async (req, res) => {
  try {
    const count = await Booking.countDocuments();
    res.send({ success: true, count });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;