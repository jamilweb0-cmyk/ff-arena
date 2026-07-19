const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// =======================
// REGISTER
// =======================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).send({
        message: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).send({
      message: "User registered successfully",
    });

  } catch (error) {

    res.status(500).send({
      message: error.message,
    });

  }
});


// =======================
// LOGIN
// =======================
router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).send({
        message: "Wrong password",
      });
    }

    const token = jwt.sign(
      {
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

    res.send({
      message: "Login successful",
      token,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
      },
    });

  } catch (error) {

    res.status(500).send({
      message: error.message,
    });

  }

});


// =======================
// ME
// =======================
router.get(
  "/me",
  verifyToken,
  async (req, res) => {

    try {

      const user =
        await User.findOne({
          email:
            req.user.email,
        }).select("-password");

      if (!user) {

        return res.status(404).send({
          message:
            "User not found",
        });

      }

      res.send(user);

    } catch (error) {

      res.status(500).send({
        message:
          error.message,
      });

    }

  }
);


// =======================
// LOGOUT
// =======================
router.post("/logout", (req, res) => {

  res.clearCookie("token", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
});

  res.send({
    message:
      "Logged out successfully",
  });

});


// =======================
// TEST
// =======================
router.get("/test", (req, res) => {
  res.send("Auth Route Working");
});

module.exports = router;