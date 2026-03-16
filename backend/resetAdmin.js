const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = require('./models/User');
  const hash = await bcrypt.hash('admin123', 12);
  await User.updateOne({ role: 'admin' }, { password: hash, isActive: true });
  console.log('Done! Login with admin@gmail.com / admin123');
  process.exit(0);
});