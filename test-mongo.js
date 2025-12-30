const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "SkdData",
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ Connected to MongoDB');
    
    // Check YouTubeVideos collection
    const YouTubeVideo = require('./server/models/YouTubeVideo');
    const count = await YouTubeVideo.countDocuments();
    console.log('Found ' + count + ' videos in the database');
    
    if (count > 0) {
      const videos = await YouTubeVideo.find().limit(2);
      console.log('Sample videos:');
      console.log(JSON.stringify(videos, null, 2));
    } else {
      console.log('No videos found in the database');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testConnection();
