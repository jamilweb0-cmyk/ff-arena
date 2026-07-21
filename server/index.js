const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const statsRoutes = require("./routes/statsRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const port = process.env.PORT || 5000;

// ✅ CORS: Allow All Origins (Vercel Production & Preview এর জন্য)
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

// Database Connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/stats", statsRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("FF Arena Server Running ");
});

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});