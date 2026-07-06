const express = require("express");

const Room = require("../models/Room");
const Booking = require("../models/Booking");

const verifyToken = require("../middleware/verifyToken");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const router = express.Router();

/*
==========================================
CREATE ROOM
POST /api/rooms
==========================================
*/

router.post(
  "/",
  verifyToken,
  asyncHandler(async (req, res) => {
    const {
      room_name,
      map,
      game_mode,
      entry_fee,
      prize_pool,
      image,
    } = req.body;

    if (
      !room_name ||
      !map ||
      !game_mode ||
      !entry_fee ||
      !prize_pool ||
      !image
    ) {
      return ApiResponse.error(
        res,
        "All fields are required",
        400
      );
    }

    const room = new Room({
      room_name,
      map,
      game_mode,
      entry_fee: Number(entry_fee),
      prize_pool: Number(prize_pool),
      image,
      host_email: req.user.email,
    });

    await room.save();

    ApiResponse.success(
      res,
      "Room Added Successfully",
      room,
      201
    );
  })
);

/*
==========================================
GET ALL ROOMS
SEARCH + FILTER + PAGINATION
GET /api/rooms
==========================================
*/

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const {
      search = "",
      map = "",
      page = 1,
      limit = 6,
    } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const query = {};

    if (search) {
      query.room_name = {
        $regex: search,
        $options: "i",
      };
    }

    if (map) {
      query.map = map;
    }

    const totalRooms =
      await Room.countDocuments(query);

    const rooms =
      await Room.find(query)
        .sort({
          createdAt: -1,
        })
        .skip(
          (pageNumber - 1) *
            limitNumber
        )
        .limit(limitNumber);

    ApiResponse.success(
      res,
      "Rooms fetched successfully",
      {
        rooms,
        totalRooms,
        currentPage: pageNumber,
        totalPages: Math.ceil(
          totalRooms /
            limitNumber
        ),
      }
    );
  })
);

/*
==========================================
GET MY ROOMS
GET /api/rooms/myrooms
==========================================
*/

router.get(
  "/myrooms",
  verifyToken,
  asyncHandler(async (req, res) => {
    const rooms =
      await Room.find({
        host_email:
          req.user.email,
      }).sort({
        createdAt: -1,
      });

    ApiResponse.success(
      res,
      "My Rooms",
      rooms
    );
  })
);

/*
==========================================
ROOM DASHBOARD STATS
GET /api/rooms/stats
==========================================
*/

router.get(
  "/stats/dashboard",
  asyncHandler(async (req, res) => {

    const totalRooms =
      await Room.countDocuments();

    const totalBookings =
      await Booking.countDocuments();

    const totalPrize =
      await Room.aggregate([
        {
          $group: {
            _id: null,
            totalPrize: {
              $sum: "$prize_pool",
            },
          },
        },
      ]);

    const totalEntry =
      await Room.aggregate([
        {
          $group: {
            _id: null,
            totalEntry: {
              $sum: "$entry_fee",
            },
          },
        },
      ]);

    ApiResponse.success(
      res,
      "Dashboard Statistics",
      {
        totalRooms,
        totalBookings,
        totalPrize:
          totalPrize[0]?.totalPrize || 0,
        totalEntry:
          totalEntry[0]?.totalEntry || 0,
      }
    );

  })
);

/*
==========================================
TOP ROOMS
GET /api/rooms/top
==========================================
*/

router.get(
  "/top",
  asyncHandler(async (req, res) => {

    const rooms =
      await Room.find()
        .sort({
          prize_pool: -1,
        })
        .limit(5);

    ApiResponse.success(
      res,
      "Top Rooms",
      rooms
    );

  })
);

/*
==========================================
TRENDING ROOMS
GET /api/rooms/trending
==========================================
*/

router.get(
  "/trending",
  asyncHandler(async (req, res) => {

    const trending =
      await Booking.aggregate([

        {
          $group: {
            _id: "$roomId",
            totalBookings: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            totalBookings: -1,
          },
        },

        {
          $limit: 5,
        },

      ]);

    ApiResponse.success(
      res,
      "Trending Rooms",
      trending
    );

  })
);

/*
==========================================
GET SINGLE ROOM
GET /api/rooms/:id
==========================================
*/

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return ApiResponse.error(
        res,
        "Room Not Found",
        404
      );
    }

    const bookedCount =
      await Booking.countDocuments({
        roomId: req.params.id,
      });

    ApiResponse.success(
      res,
      "Room Details",
      {
        ...room.toObject(),
        bookedCount,
        availableSlots: Math.max(
          20 - bookedCount,
          0
        ),
      }
    );
  })
);

/*
==========================================
UPDATE ROOM
PUT /api/rooms/:id
==========================================
*/

router.put(
  "/:id",
  verifyToken,
  asyncHandler(async (req, res) => {
    const room =
      await Room.findById(req.params.id);

    if (!room) {
      return ApiResponse.error(
        res,
        "Room Not Found",
        404
      );
    }

    if (
      room.host_email !==
      req.user.email
    ) {
      return ApiResponse.error(
        res,
        "Forbidden Access",
        403
      );
    }

    const {
      room_name,
      map,
      game_mode,
      entry_fee,
      prize_pool,
      image,
    } = req.body;

    const updatedRoom =
      await Room.findByIdAndUpdate(
        req.params.id,
        {
          room_name,
          map,
          game_mode,
          entry_fee:
            Number(entry_fee),
          prize_pool:
            Number(prize_pool),
          image,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    ApiResponse.success(
      res,
      "Room Updated Successfully",
      updatedRoom
    );
  })
);

/*
==========================================
DELETE ROOM
DELETE /api/rooms/:id
==========================================
*/

router.delete(
  "/:id",
  verifyToken,
  asyncHandler(async (req, res) => {
    const room =
      await Room.findById(req.params.id);

    if (!room) {
      return ApiResponse.error(
        res,
        "Room Not Found",
        404
      );
    }

    if (
      room.host_email !==
      req.user.email
    ) {
      return ApiResponse.error(
        res,
        "Forbidden Access",
        403
      );
    }

    await Room.findByIdAndDelete(
      req.params.id
    );

    ApiResponse.success(
      res,
      "Room Deleted Successfully"
    );
  })
);

/*
==========================================
EXPORT ROUTER
==========================================
*/

module.exports = router;