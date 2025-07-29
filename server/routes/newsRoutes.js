const express = require("express");
const router = express.Router();
const News = require("../models/News");
router.post("/add", async (req, res) => {
  try {
    console.log("🛠 News add request body:", req.body); // 👈 Add this

    const { title, htmlContent, tags, ribbon } = req.body;

    const news = new News({
      title,
      htmlContent,
      tags, // ✅ should be an array
      ribbon,
    });

    await news.save();

    res.status(201).json({ message: "News added successfully" });
  } catch (err) {
    console.error("❌ Failed to add news:", err); // 👈 Add this too
    res.status(500).json({ error: "Server error while adding news" });
  }
});
// GET all news sorted by most recent
router.get("/all", async (req, res) => {
  try {
    const newsList = await News.find().sort({ createdAt: -1 }); // newest first
    res.json(newsList);
  } catch (err) {
    console.error("❌ Failed to fetch news:", err);
    res.status(500).json({ error: "Server error while fetching news" });
  }
});

module.exports = router;
