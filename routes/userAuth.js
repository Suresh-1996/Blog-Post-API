const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { generateToken, userGenerateToken } = require("../utils/generateToken");
const jwt = require("jsonwebtoken");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid  password" });
    }

    // Generate token
    const token = userGenerateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

router.post("/create", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating User", error });
  }
});

module.exports = router;
