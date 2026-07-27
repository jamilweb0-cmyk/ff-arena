const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

const createToken = (email) => jwt.sign({ email }, JWT_SECRET, { expiresIn: "7d" });

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hash, provider: "email" });
    await user.save();
    res.status(201).json({ message: "Registration Successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// EMAIL LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.provider === "google") return res.status(400).json({ message: "Please login with Google" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const token = createToken(user.email);
    
    // Cookie এবং Response দুটোতেই Token পাঠানো হচ্ছে (Double Safety)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({ 
      message: "Login Successful", 
      token, 
      user: { _id: user._id, name: user.name, email: user.email, photo: user.photo } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GOOGLE LOGIN
router.post("/google", async (req, res) => {
  try {
    const { name, email, photo } = req.body;
    if (!email) return res.status(400).json({ message: "Email Required" });

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, photo, password: "", provider: "google" });
      await user.save();
    }

    const token = createToken(user.email);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({ message: "Google Login Successful", token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CURRENT USER
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });
  res.json({ message: "Logout Successful" });
});

module.exports = router;