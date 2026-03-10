const mongoose = require("mongoose")

const querySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  subject: String,
  message: String,
  adminReply: String
}, { timestamps: true })

module.exports = mongoose.model("Query", querySchema)