/**
 * Image Compression Script
 * Run: node compress-images.js
 * 
 * This will compress large images in client/public folder
 */

const fs = require('fs');
const path = require('path');

console.log('🖼️  Image Compression Helper\n');
console.log('⚠️  CRITICAL: Your website has 28.3 MB of uncompressed images!\n');
console.log('📊 Large images found:');
console.log('   - slide1.jpg.JPG: 12.8 MB');
console.log('   - slide2.jpg.JPG: 7.6 MB');
console.log('   - slide3.jpg.JPG: 7.9 MB');
console.log('   - Logo files: 3.5 MB combined');
console.log('   - GIF files: 3.1 MB combined\n');

console.log('🎯 SOLUTION OPTIONS:\n');

console.log('Option 1: Online Compression (Easiest - 5 minutes)');
console.log('   1. Go to: https://tinypng.com/');
console.log('   2. Upload: client/public/slide1.jpg.JPG');
console.log('   3. Upload: client/public/slide2.jpg.JPG');
console.log('   4. Upload: client/public/slide3.jpg.JPG');
console.log('   5. Download compressed versions');
console.log('   6. Replace original files');
console.log('   7. Run: git add client/public && git commit -m "Compress images" && git push\n');

console.log('Option 2: Use Sharp CLI (Automated)');
console.log('   1. Install: npm install -g sharp-cli');
console.log('   2. Run this script again\n');

console.log('Option 3: Use Cloudinary (Best for production)');
console.log('   1. Sign up: https://cloudinary.com/');
console.log('   2. Upload images');
console.log('   3. Get optimized URLs');
console.log('   4. Update AboutUs.css with new URLs\n');

console.log('⚡ EXPECTED RESULTS:');
console.log('   - 95% size reduction (28 MB → 1-2 MB)');
console.log('   - 5-10x faster page load');
console.log('   - Better mobile experience\n');

console.log('📝 After compressing, commit changes:');
console.log('   git add client/public');
console.log('   git commit -m "Optimize images for faster loading"');
console.log('   git push origin main\n');

// Check if sharp is installed
try {
  require.resolve('sharp');
  console.log('✅ Sharp is installed! Running automatic compression...\n');
  compressImages();
} catch (e) {
  console.log('ℹ️  For automatic compression, install sharp:');
  console.log('   npm install sharp\n');
  console.log('💡 Or use Option 1 (TinyPNG) - it\'s faster and easier!\n');
}

async function compressImages() {
  const sharp = require('sharp');
  const publicDir = path.join(__dirname, 'client', 'public');
  
  const imagesToCompress = [
    'slide1.jpg.JPG',
    'slide2.jpg.JPG',
    'slide3.jpg.JPG'
  ];

  console.log('🔄 Compressing images...\n');

  for (const image of imagesToCompress) {
    const inputPath = path.join(publicDir, image);
    const outputPath = path.join(publicDir, `optimized-${image}`);

    if (fs.existsSync(inputPath)) {
      try {
        const originalSize = fs.statSync(inputPath).size;
        
        await sharp(inputPath)
          .resize(1920, 1080, { fit: 'cover' })
          .jpeg({ quality: 80, progressive: true })
          .toFile(outputPath);

        const newSize = fs.statSync(outputPath).size;
        const reduction = ((1 - newSize / originalSize) * 100).toFixed(1);

        console.log(`✅ ${image}`);
        console.log(`   Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   Compressed: ${(newSize / 1024).toFixed(2)} KB`);
        console.log(`   Reduction: ${reduction}%\n`);
      } catch (error) {
        console.log(`❌ Error compressing ${image}:`, error.message);
      }
    } else {
      console.log(`⚠️  ${image} not found`);
    }
  }

  console.log('\n✅ Compression complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Review optimized images in client/public/');
  console.log('   2. If satisfied, replace original files');
  console.log('   3. Delete "optimized-" prefix from filenames');
  console.log('   4. Commit: git add client/public && git commit -m "Compress images" && git push');
}
