const fs = require('fs');
const path = require('path');

// Using standard connection string format with additional options
const envContent = `# Database
MONGO_URI=mongodb+srv://sadhnasinghitsme:0m1G1S3vXgX0mN2X@cluster0.7hq8z.mongodb.net/SkdData?retryWrites=true&w=majority&connectTimeoutMS=10000&socketTimeoutMS=45000&serverSelectionTimeoutMS=5000

# Server Configuration
PORT=3001
NODE_ENV=development

# Debug settings
DEBUG=mongoose:*`;

const envPath = path.join(__dirname, '.env');

// Delete existing .env file if it exists
if (fs.existsSync(envPath)) {
  fs.unlinkSync(envPath);
  console.log('♻️  Removed existing .env file');
}

// Create new .env file
fs.writeFileSync(envPath, envContent, { mode: 0o600 });

console.log('✅ .env file has been updated with the correct settings');
console.log('🔗 Connection string includes timeout settings for better reliability');
console.log('\nNext steps:');
console.log('1. Check your MongoDB Atlas Network Access settings');
console.log('2. Make sure your IP is whitelisted');
console.log('3. Run: node test-db-connection.js');
