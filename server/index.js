const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const statsRoutes = require("./routes/statsRoutes");

const app = express();
const port = process.env.PORT || 5000;

// =======================
// Middleware (সবার আগে!)
// =======================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ff-arena-three.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// =======================
// Database
// =======================

connectDB();

// =======================
// Routes (CORS এর পরে!)
// =======================

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/stats", statsRoutes); // ✅ CORS এর পরে

// =======================
// Error Handler
// =======================

const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

// =======================
// Test Route
// =======================

app.get("/", (req, res) => {
  res.send("FF Arena Server Running 🚀");
});

// =======================
// Start Server
// =======================

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});