// Load environment variables
require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "SkdData",
      serverSelectionTimeoutMS: 5000
    });
    
    console.log('✅ Connected to MongoDB');
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nAvailable collections:');
    collections.forEach(c => console.log(- ));
    
    // Check if youtubevideos collection exists
    const hasYouTubeVideos = collections.some(c => c.name === 'youtubevideos');
    console.log(hasYouTubeVideos ? '\n✅ Found youtubevideos collection' : '\n❌ youtubevideos collection not found');
    
    if (hasYouTubeVideos) {
      const YouTubeVideo = require('./server/models/YouTubeVideo');
      const count = await YouTubeVideo.countDocuments();
      console.log(\nFound  videos in the database);
      
      if (count > 0) {
        const videos = await YouTubeVideo.find().limit(2).lean();
        console.log('\nSample videos:');
        videos.forEach((v, i) => {
          console.log(\nVideo :);
          console.log(Title: );
          console.log(URL: );
          console.log(Has thumbnail: );
        });
      }
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code === 'MONGODB_DUPLICATE_KEY') {
      console.log('Duplicate key error - check for duplicate _id values');
    }
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('\nDisconnected from MongoDB');
    }
    process.exit(0);
  }
}

testConnection();
