// models/News.js
const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title: String,
  htmlContent: String,
  tags: [String],
  ribbon: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("News", newsSchema);
