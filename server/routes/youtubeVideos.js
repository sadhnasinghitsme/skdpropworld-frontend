const express = require("express");
const router = express.Router();
const YouTubeVideo = require("../models/YouTubeVideo");

// Get all videos
router.get("/", async (req, res) => {
  try {
    const videos = await YouTubeVideo.find().sort({ createdAt: -1 });
    if (!videos || videos.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "No videos found" 
      });
    }
    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ 
      success: false,
      message: "Server error while fetching videos",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;