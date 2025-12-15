/**
 * Video Compression Script for Hero Background
 * 
 * This script compresses the hero video to reduce file size
 * while maintaining acceptable quality for background use.
 * 
 * Requirements: FFmpeg must be installed
 * Install: https://ffmpeg.org/download.html
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const INPUT_VIDEO = 'client/public/videos/hero-video-compressed.mp4';
const OUTPUT_VIDEO = 'client/public/videos/hero-video-optimized.mp4';
const POSTER_IMAGE = 'client/public/hero-poster.jpg';

console.log('🎬 Starting video compression...\n');

// Check if FFmpeg is installed
try {
  execSync('ffmpeg -version', { stdio: 'ignore' });
  console.log('✅ FFmpeg is installed\n');
} catch (error) {
  console.error('❌ FFmpeg is not installed!');
  console.error('Please install FFmpeg from: https://ffmpeg.org/download.html');
  process.exit(1);
}

// Check if input video exists
if (!fs.existsSync(INPUT_VIDEO)) {
  console.error(`❌ Input video not found: ${INPUT_VIDEO}`);
  process.exit(1);
}

// Get original file size
const originalSize = fs.statSync(INPUT_VIDEO).size / (1024 * 1024);
console.log(`📊 Original video size: ${originalSize.toFixed(2)} MB\n`);

try {
  // Step 1: Compress video to under 2MB
  console.log('🔄 Compressing video (target: under 2MB)...');
  console.log('This may take a few minutes...\n');
  
  execSync(`ffmpeg -i ${INPUT_VIDEO} \
    -vcodec h264 \
    -crf 32 \
    -preset slow \
    -vf "scale=1280:720" \
    -movflags +faststart \
    -an \
    ${OUTPUT_VIDEO} -y`, 
    { stdio: 'inherit' }
  );
  
  const compressedSize = fs.statSync(OUTPUT_VIDEO).size / (1024 * 1024);
  const reduction = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
  
  console.log('\n✅ Video compressed successfully!');
  console.log(`📊 New video size: ${compressedSize.toFixed(2)} MB`);
  console.log(`📉 Size reduction: ${reduction}%\n`);
  
  // Step 2: Generate poster image from first frame
  console.log('🖼️  Generating poster image...');
  
  execSync(`ffmpeg -i ${OUTPUT_VIDEO} \
    -ss 00:00:01 \
    -vframes 1 \
    -vf "scale=1920:1080" \
    ${POSTER_IMAGE} -y`,
    { stdio: 'inherit' }
  );
  
  const posterSize = fs.statSync(POSTER_IMAGE).size / 1024;
  console.log(`✅ Poster image created: ${posterSize.toFixed(2)} KB\n`);
  
  // Step 3: Replace old video with new one
  console.log('🔄 Replacing old video with optimized version...');
  fs.renameSync(INPUT_VIDEO, INPUT_VIDEO.replace('.mp4', '-backup.mp4'));
  fs.renameSync(OUTPUT_VIDEO, INPUT_VIDEO);
  console.log('✅ Video replaced successfully!\n');
  
  console.log('🎉 Optimization complete!');
  console.log('\n📋 Summary:');
  console.log(`   Original: ${originalSize.toFixed(2)} MB`);
  console.log(`   Optimized: ${compressedSize.toFixed(2)} MB`);
  console.log(`   Savings: ${(originalSize - compressedSize).toFixed(2)} MB (${reduction}%)`);
  console.log(`   Poster: ${posterSize.toFixed(2)} KB`);
  console.log('\n✅ Your website will now load much faster!');
  console.log('\n📝 Next steps:');
  console.log('   1. Test the video on localhost');
  console.log('   2. If satisfied, commit and push changes');
  console.log('   3. Deploy to production');
  
} catch (error) {
  console.error('\n❌ Error during compression:', error.message);
  process.exit(1);
}
