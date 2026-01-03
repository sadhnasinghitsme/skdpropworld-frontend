const axios = require('axios');

const API_BASE = 'http://localhost:3001';

// Admin user details
const adminData = {
  name: "SKD PropWorld Admin",
  email: "admin@skdpropworld.com",
  password: "SKDAdmin2025!",
  secretCode: "SKD_ADMIN_2025"
};

async function createAdmin() {
  try {
    console.log('🔐 Creating admin user...');
    
    const response = await axios.post(`${API_BASE}/api/admin/signup`, adminData);
    
    console.log('✅ Admin user created successfully!');
    console.log('\n📋 Admin Login Details:');
    console.log(`Email: ${adminData.email}`);
    console.log(`Password: ${adminData.password}`);
    console.log('\n🌐 Access admin panel at: http://localhost:5173/admin/login');
    
  } catch (error) {
    if (error.response?.status === 409) {
      console.log('ℹ️  Admin user already exists!');
      console.log('\n📋 Use these login details:');
      console.log(`Email: ${adminData.email}`);
      console.log(`Password: ${adminData.password}`);
      console.log('\n🌐 Access admin panel at: http://localhost:5173/admin/login');
    } else {
      console.error('❌ Error creating admin:', error.response?.data || error.message);
    }
  }
}

createAdmin();