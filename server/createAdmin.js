const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "SkdData",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Admin details
    const adminData = {
      name: 'Admin User',
      email: 'admin@skdpropworld.com',
      password: 'Admin@123', // Change this to a secure password
      role: 'SuperAdmin'
    };

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('ℹ️ Admin already exists');
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    adminData.password = await bcrypt.hash(adminData.password, salt);

    // Create admin
    const admin = new Admin(adminData);
    await admin.save();

    console.log('✅ Admin created successfully');
    console.log('Email:', adminData.email);
    console.log('Password: Admin@123'); // Show the password once

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
