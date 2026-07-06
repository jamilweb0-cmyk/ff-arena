const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    room_name: {
      type: String,
      required: true,
    },

    map: {
      type: String,
      required: true,
    },

    game_mode: {
      type: String,
      required: true,
    },

    entry_fee: {
      type: Number,
      required: true,
    },

    prize_pool: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    host_email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

roomSchema.index({

  room_name:1,

});

roomSchema.index({

  map:1,

});

roomSchema.index({

  createdAt:-1,

});

module.exports = mongoose.model("Room", roomSchema);