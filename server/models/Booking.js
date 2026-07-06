const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
    },

    room_name: {
      type: String,
      required: true,
    },

    user_email: {
      type: String,
      required: true,
    },

    booking_date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Booking",
  bookingSchema
);