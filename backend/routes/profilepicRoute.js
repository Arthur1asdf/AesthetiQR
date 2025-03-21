import express from "express";
import ProfilePic from "../models/profilepic.js";

const router = express.Router();

// POST: when the user first logs in or creates a profile do this however make a default profile picture
// and the user will only be able to update profile pic.
router.post("/", async (req, res) => {
  const { userId, imageUrl } = req.body;
  if (!userId || !imageUrl) {
    return res.status(400).json({ error: "User ID and image URL are required" });
  }
  try {
    const profilePic = await ProfilePic.create({ user: userId, imageUrl });
    res.status(201).json({ success: true, data: profilePic });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET: Retrieve a user's profile picture
router.get("/:userId", async (req, res) => {
  try {
    const profilePic = await ProfilePic.findOne({ user: req.params.userId });
    if (!profilePic) {
      return res.status(404).json({ error: "Profile picture not found" });
    }
    res.status(200).json({ success: true, data: profilePic });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT: Update a user's profile picture
router.put("/:userId", async (req, res) => {
  try {
    const updatedPic = await ProfilePic.findOneAndUpdate({ user: req.params.userId }, { imageUrl: req.body.imageUrl }, { new: true });
    if (!updatedPic) {
      return res.status(404).json({ error: "Profile picture not found" });
    }
    res.status(200).json({ success: true, data: updatedPic });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE: Remove a user's profile picture
router.delete("/:userId", async (req, res) => {
  try {
    const deletedPic = await ProfilePic.findOneAndDelete({ user: req.params.userId });
    if (!deletedPic) {
      return res.status(404).json({ error: "Profile picture not found" });
    }
    res.status(200).json({ success: true, message: "Profile picture deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
