const fs = require('fs');
const path = require('path');

const envContent = `# Database
MONGO_URI=mongodb+srv://sadhnasinghitsme:0m1G1S3vXgX0mN2X@cluster0.7hq8z.mongodb.net/SkdData?retryWrites=true&w=majority&connectTimeoutMS=10000&socketTimeoutMS=45000

# Server Configuration
PORT=3001
NODE_ENV=development
`;

const envPath = path.join(__dirname, '.env');

// Delete existing .env file if it exists
if (fs.existsSync(envPath)) {
  fs.unlinkSync(envPath);
  console.log('♻️  Removed existing .env file');
}

// Create new .env file
fs.writeFileSync(envPath, envContent, { mode: 0o600 });

console.log('✅ .env file has been updated with the correct settings');
console.log('🔒 File permissions set to owner-only access');
console.log('🔗 Connection string includes timeout settings for better reliability');

// Show the current directory contents to verify
console.log('\n📂 Current directory contents:');
fs.readdirSync(__dirname).forEach(file => {
  console.log(`- ${file}${file === '.env' ? ' (updated)' : ''}`);
});
