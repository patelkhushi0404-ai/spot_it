const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const Worker = require('./models/Worker');
  await Worker.updateMany(
    { isActive: { $exists: false } },
    { $set: { isActive: true } }
  );
  console.log('Workers fixed!');
  process.exit(0);
});