// server/scripts/createAdmin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const adminEmail = 'admin@fyp.com';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists in the database.');
      process.exit(0);
    }

    // Create a secure real admin user
    const newAdmin = await User.create({
      name: 'System Admin',
      email: adminEmail,
      password: 'adminpassword', // It will be automatically hashed by User model pre-save hook
      role: 'admin',
      isVerified: true,
      avatar: 'https://github.com/shadcn.png'
    });

    console.log(`🎉 Real Admin User created successfully!`);
    console.log(`Email: ${newAdmin.email}`);
    console.log(`Password: adminpassword`);
    console.log(`Role: ${newAdmin.role}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
    process.exit(1);
  }
}

createAdmin();
