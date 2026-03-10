const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true
  },
  password: String,
  points: {
    type: Number,
    default: 0
  },
  totalReports: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    default: "user"
  }
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)