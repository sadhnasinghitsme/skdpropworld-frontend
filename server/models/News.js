const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  excerpt: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  link: {
    type: String,
    trim: true
  },
  visible: {
    type: Boolean,
    default: true
  },
  author: {
    type: String,
    default: 'SKD Propworld'
  },
  category: {
    type: String,
    enum: ['YEIDA Updates', 'Market News', 'Infrastructure', 'Government Policies', 'General'],
    default: 'YEIDA Updates'
  }
}, {
  timestamps: true
});

// Index for faster queries
newsSchema.index({ date: -1 });
newsSchema.index({ visible: 1 });

module.exports = mongoose.model('News', newsSchema);
