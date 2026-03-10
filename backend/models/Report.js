const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  location: {
    lat: Number,
    lng: Number,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Report", ReportSchema);