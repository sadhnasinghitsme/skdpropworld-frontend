const fs = require('fs');
const path = require('path');

const envContent = `# Database
MONGO_URI=mongodb+srv://sadhnasinghitsme:0m1G1S3vXgX0mN2X@cluster0.7hq8z.mongodb.net/SkdData?retryWrites=true&w=majority

# Server Configuration
PORT=3001
NODE_ENV=development
`;

const envPath = path.join(__dirname, '.env');

fs.writeFile(envPath, envContent, (err) => {
  if (err) {
    console.error('❌ Error creating .env file:', err);
    return;
  }
  console.log('✅ .env file created successfully!');
  console.log('🛡️  Please ensure this file is in your .gitignore for security');
});
