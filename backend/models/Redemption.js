const mongoose = require('mongoose');

const redemptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reward: { type: mongoose.Schema.Types.ObjectId, ref: 'Reward' },
    rewardTitle: { type: String },
    pointsUsed: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed'], default: 'completed' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Redemption', redemptionSchema);