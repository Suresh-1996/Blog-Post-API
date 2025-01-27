const express = require("express");
const Post = require("../models/Post");
const multer = require("multer");

const router = express.Router();

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory where images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newPost = new Post({ title, content, image });
    await newPost.save();

    // Emit real-time update event
    const io = req.app.get("io");
    io.emit("postUpdate");

    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

//Get all posts

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;
    const updateData = { title, content };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    // Emit real-time update event
    const io = req.app.get("io");
    io.emit("postUpdate");

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update post" });
  }
});

// Create a new post

// router.post("/", async (req, res) => {
//   const { title, content } = req.body;
//   try {
//     const newPost = new Post({ title, content });
//     await newPost.save();
//     res.status(201).json(newPost);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

//Edit a post

// router.put("/:id", async (req, res) => {
//   const { title, content } = req.body;
//   try {
//     const updatedPost = await Post.findByIdAndUpdate(
//       req.params.id,
//       { title, content },
//       { new: true }
//     );
//     res.status(200).json(updatedPost);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

//Delete a post

router.delete("/:id", async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    // Emit real-time update event
    const io = req.app.get("io");
    io.emit("postUpdate");

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
