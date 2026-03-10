const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    type: {
      type: String,
      enum: ['gift_voucher', 'cashback', 'certificate'],
      required: true,
    },
    pointsRequired: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reward', rewardSchema);