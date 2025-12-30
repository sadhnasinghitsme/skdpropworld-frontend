const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

async function testConnection() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'SkdData',
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Successfully connected to MongoDB');
    
    // Check YouTubeVideo collection
    const YouTubeVideo = require('./server/models/YouTubeVideo');
    const videoCount = await YouTubeVideo.countDocuments();
    
    console.log(`\n📊 YouTube Videos in database: ${videoCount}`);
    
    if (videoCount > 0) {
      console.log('\n📽️ Sample video:');
      const sampleVideo = await YouTubeVideo.findOne();
      console.log(JSON.stringify(sampleVideo, null, 2));
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

testConnection();
