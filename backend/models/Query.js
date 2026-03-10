const mongoose = require('mongoose');

const querySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: {
      type: String,
      enum: ['report_issue', 'reward_issue', 'general'],
      required: true,
    },
    subject: { type: String, required: true, trim: true },
    messages: [
      {
        sender: { type: String, enum: ['user', 'admin'], required: true },
        text: { type: String, required: true },
        attachment: { type: String, default: '' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ['open', 'replied', 'closed'],
      default: 'open',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Query', querySchema);