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

app.use("/api/stats", statsRoutes);

// =======================
// Middleware
// =======================

// ✅ CORS Configuration - Allow ALL Origins
app.use(
  cors({
    origin: true, // যেকোনো URL থেকে request allow করবে
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json());
app.use(cookieParser());

// =======================
// Database
// =======================

connectDB();

// =======================
// Routes
// =======================

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);

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