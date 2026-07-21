const express = require("express");
const Room = require("../models/Room");
const Booking = require("../models/Booking");
const verifyToken = require("../middleware/verifyToken");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const router = express.Router();

// CREATE ROOM
router.post("/", verifyToken, asyncHandler(async (req, res) => {
  const { room_name, map, game_mode, entry_fee, prize_pool, image } = req.body;
  if (!room_name || !map || !game_mode || !entry_fee || !prize_pool || !image) {
    return ApiResponse.error(res, "All fields are required", 400);
  }
  const room = new Room({ room_name, map, game_mode, entry_fee: Number(entry_fee), prize_pool: Number(prize_pool), image, host_email: req.user.email });
  await room.save();
  ApiResponse.success(res, "Room Added Successfully", room, 201);
}));

// GET ALL ROOMS (Search + Filter + Pagination)
router.get("/", asyncHandler(async (req, res) => {
  const { search = "", map = "", page = 1, limit = 6 } = req.query;
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const query = {};

  if (search) query.room_name = { $regex: search, $options: "i" };
  if (map) query.map = map;

  const totalRooms = await Room.countDocuments(query);
  const rooms = await Room.find(query).sort({ createdAt: -1 }).skip((pageNumber - 1) * limitNumber).limit(limitNumber);

  ApiResponse.success(res, "Rooms fetched successfully", { rooms, totalRooms, currentPage: pageNumber, totalPages: Math.ceil(totalRooms / limitNumber) });
}));

// GET MY ROOMS
router.get("/myrooms", verifyToken, asyncHandler(async (req, res) => {
  const rooms = await Room.find({ host_email: req.user.email }).sort({ createdAt: -1 });
  ApiResponse.success(res, "My Rooms", rooms);
}));

// GET SINGLE ROOM
router.get("/:id", asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) return ApiResponse.error(res, "Room Not Found", 404);

  const bookedCount = await Booking.countDocuments({ roomId: req.params.id });
  ApiResponse.success(res, "Room Details", { ...room.toObject(), bookedCount, availableSlots: Math.max(20 - bookedCount, 0) });
}));

// UPDATE ROOM
router.put("/:id", verifyToken, asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) return ApiResponse.error(res, "Room Not Found", 404);
  if (room.host_email !== req.user.email) return ApiResponse.error(res, "Forbidden Access", 403);

  const { room_name, map, game_mode, entry_fee, prize_pool, image } = req.body;
  const updatedRoom = await Room.findByIdAndUpdate(req.params.id, { room_name, map, game_mode, entry_fee: Number(entry_fee), prize_pool: Number(prize_pool), image }, { new: true, runValidators: true });
  ApiResponse.success(res, "Room Updated Successfully", updatedRoom);
}));

// DELETE ROOM
router.delete("/:id", verifyToken, asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) return ApiResponse.error(res, "Room Not Found", 404);
  if (room.host_email !== req.user.email) return ApiResponse.error(res, "Forbidden Access", 403);

  await Room.findByIdAndDelete(req.params.id);
  ApiResponse.success(res, "Room Deleted Successfully");
}));

module.exports = router;