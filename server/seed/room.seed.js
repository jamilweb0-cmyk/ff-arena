const mongoose = require("mongoose");
const Room = require("../models/Room");
require("dotenv").config();
const connectDB = require("../config/db");

const seedRooms = async () => {
  try {

    await connectDB();

    await Room.deleteMany();

    await Room.insertMany([
      {
        room_name: "Clash Squad Pro",
        map: "Bermuda",
        game_mode: "Clash Squad",
        entry_fee: 50,
        prize_pool: 5000,
        image: "https://picsum.photos/600/400?1",
        host_email: "admin@ffarena.com",
      },
      {
        room_name: "Bermuda Elite Room",
        map: "Bermuda",
        game_mode: "Squad Battle",
        entry_fee: 100,
        prize_pool: 10000,
        image: "https://picsum.photos/600/400?2",
        host_email: "admin@ffarena.com",
      },
      {
        room_name: "Kalahari Pro League",
        map: "Kalahari",
        game_mode: "Solo Clash",
        entry_fee: 75,
        prize_pool: 8000,
        image: "https://picsum.photos/600/400?3",
        host_email: "admin@ffarena.com",
      },
    ]);

    console.log("🔥 Seed Data Inserted");

    await mongoose.disconnect();

    process.exit();

  } catch (error) {

    console.log("Seed Error:", error.message);

    process.exit(1);

  }
};

seedRooms();