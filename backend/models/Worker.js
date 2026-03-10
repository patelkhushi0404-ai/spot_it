const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Worker name is required'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    area: {
      type: String,
      trim: true,
      default: '',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    totalAssigned: {
      type: Number,
      default: 0,
    },
    totalCleared: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Worker', workerSchema);