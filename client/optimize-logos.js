import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, 'public');

// Logos to optimize
const logos = [
  'Skd Propworld Logo6.png',
  'Skd Propworld Logo5.png',
  'Skd Propworld Logo3.png',
  'Skd Propworld Logo4.png'
];

async function optimizeLogos() {
  console.log('🎨 Starting logo optimization...\n');
  
  for (const logo of logos) {
    const inputPath = path.join(publicDir, logo);
    
    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  Skipped: ${logo} (not found)`);
      continue;
    }
    
    const stats = fs.statSync(inputPath);
    const originalSize = (stats.size / 1024 / 1024).toFixed(2);
    
    try {
      // Create backup
      const backupPath = path.join(publicDir, logo.replace('.png', '-original.png'));
      if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(inputPath, backupPath);
      }
      
      // Optimize
      await sharp(inputPath)
        .resize(800, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .png({ 
          quality: 85, 
          compressionLevel: 9,
          palette: true
        })
        .toFile(inputPath + '.tmp');
      
      // Replace original
      fs.renameSync(inputPath + '.tmp', inputPath);
      
      const newStats = fs.statSync(inputPath);
      const newSize = (newStats.size / 1024 / 1024).toFixed(2);
      const savings = ((1 - newStats.size / stats.size) * 100).toFixed(1);
      
      console.log(`✅ ${logo}`);
      console.log(`   ${originalSize} MB → ${newSize} MB (${savings}% smaller)\n`);
    } catch (error) {
      console.error(`❌ Error optimizing ${logo}:`, error.message);
    }
  }
  
  console.log('🎉 Logo optimization complete!');
  console.log('💾 Original files backed up with "-original" suffix');
}

optimizeLogos().catch(console.error);
