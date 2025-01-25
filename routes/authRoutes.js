const express = require("express");
const bcrypt = require("bcrypt");
const AdminUser = require("../models/Admin");
const { generateToken, userGenerateToken } = require("../utils/generateToken");
const jwt = require("jsonwebtoken");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await AdminUser.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid  password" });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, isAdmin: user.isAdmin },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

router.post("/create", protect, adminOnly, async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await AdminUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const newUser = new User({
      name,
      email,
      password,
      isAdmin: true,
    });

    await newUser.save();
    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating admin", error });
  }
});

module.exports = router;
