// Load environment variables
require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('MongoDB URI from .env:', process.env.MONGO_URI ? 'Found (hidden for security)' : 'Not found');
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "SkdData",
      serverSelectionTimeoutMS: 5000
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Check if YouTubeVideos collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const youtubeCollection = collections.find(c => c.name === 'youtubevideos');
    
    if (!youtubeCollection) {
      console.log('❌ YouTubeVideos collection not found in the database');
      console.log('Available collections:');
      console.log(collections.map(c => - ).join('\n'));
      return;
    }
    
    // Get video count
    const YouTubeVideo = require('./server/models/YouTubeVideo');
    const count = await YouTubeVideo.countDocuments();
    console.log(Found  videos in the YouTubeVideos collection);
    
    if (count > 0) {
      const videos = await YouTubeVideo.find().limit(2).lean();
      console.log('Sample videos:');
      console.log(JSON.stringify(videos.map(v => ({
        _id: v._id,
        title: v.title,
        url: v.url,
        hasThumbnail: !!v.thumbnail
      })), null, 2));
    } else {
      console.log('No videos found in the YouTubeVideos collection');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'MONGODB_DUPLICATE_KEY') {
      console.log('This error usually occurs when there are duplicate _id values in the database');
    }
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

testConnection();
