const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ role: 'admin' });
    if (existing) {
      console.log('Admin already exists:', existing.email);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin123', 12);

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@spotit.com',
      password: admin123,
      role: 'admin',
      isActive: true,
    });

    console.log('Admin created successfully!');
    console.log('Email:', admin.email);
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();