const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// =======================
// CREATE JWT TOKEN
// =======================

const createToken = (email) => {
  return jwt.sign(
    { email },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// =======================
// REGISTER
// =======================

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    const exists =
      await User.findOne({
        email,
      });

    if (exists) {
      return res.status(400).send({
        message:
          "User already exists",
      });
    }

    const hash =
      await bcrypt.hash(
        password,
        10
      );

    const user = new User({
      name,
      email,
      password: hash,
      provider: "email",
    });

    await user.save();

    res.status(201).send({
      message:
        "Registration Successful",
    });

  } catch (error) {

    res.status(500).send({
      message:
        error.message,
    });

  }
});

// =======================
// EMAIL LOGIN
// =======================

router.post("/login", async (req, res) => {

  try {

    const {
      email,
      password,
    } = req.body;

    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      return res.status(404).send({
        message:
          "User not found",
      });
    }

    if (
      user.provider ===
      "google"
    ) {
      return res.status(400).send({
        message:
          "Please login with Google",
      });
    }

    const match =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!match) {
      return res.status(400).send({
        message:
          "Wrong password",
      });
    }

    const token =
      createToken(
        user.email
      );

    res.cookie(
      "token",
      token,
      {
        httpOnly: true,
        secure:
          process.env
            .NODE_ENV ===
          "production",
        sameSite:
          process.env
            .NODE_ENV ===
          "production"
            ? "none"
            : "lax",
        maxAge:
          7 *
          24 *
          60 *
          60 *
          1000,
        path: "/",
      }
    );

    res.send({
      message:
        "Login Successful",
      token,
      user: {
        _id:
          user._id,
        name:
          user.name,
        email:
          user.email,
        photo:
          user.photo,
      },
    });

  } catch (error) {

    res.status(500).send({
      message:
        error.message,
    });

  }

});

// =======================
// GOOGLE LOGIN
// =======================

router.post("/google", async (req, res) => {

  try {

    const {
      name,
      email,
      photo,
    } = req.body;

    if (!email) {
      return res.status(400).send({
        message:
          "Email Required",
      });
    }

    let user =
      await User.findOne({
        email,
      });

    if (!user) {

      user = new User({
        name,
        email,
        photo,
        password: "",
        provider: "google",
      });

      await user.save();

    }

    const token =
      createToken(
        user.email
      );

    res.cookie(
      "token",
      token,
      {
        httpOnly: true,
        secure:
          process.env
            .NODE_ENV ===
          "production",
        sameSite:
          process.env
            .NODE_ENV ===
          "production"
            ? "none"
            : "lax",
        maxAge:
          7 *
          24 *
          60 *
          60 *
          1000,
        path: "/",
      }
    );

    res.send({
      message:
        "Google Login Successful",
      token,
      user,
    });

  } catch (error) {

    res.status(500).send({
      message:
        error.message,
    });

  }

});

// =======================
// CURRENT USER
// =======================

router.get(
  "/me",
  verifyToken,
  async (
    req,
    res
  ) => {

    try {

      const user =
        await User.findOne({
          email:
            req.user
              .email,
        }).select(
          "-password"
        );

      if (!user) {
        return res
          .status(404)
          .send({
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

router.post(
  "/logout",
  (
    req,
    res
  ) => {

    res.clearCookie(
      "token",
      {
        httpOnly: true,
        secure:
          process.env
            .NODE_ENV ===
          "production",
        sameSite:
          process.env
            .NODE_ENV ===
          "production"
            ? "none"
            : "lax",
        path: "/",
      }
    );

    res.send({
      message:
        "Logout Successful",
    });

  }
);

// =======================
// TEST
// =======================

router.get(
  "/test",
  (
    req,
    res
  ) => {

    res.send(
      "Auth Route Working"
    );

  }
);

module.exports = router;