const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    image: {
      url: { type: String, required: true },
      publicId: { type: String },
    },
    location: {
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [10, "Description must be at least 10 characters"],
    },
    status: {
      type: String,
      enum: ["pending", "assigned", "inprogress", "cleared"],
      default: "pending",
    },
    assignedWorker: {
      workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Worker",
        default: null,
      },
      name: { type: String, default: "" },
      phone: { type: String, default: "" },
      area: { type: String, default: "" },
      assignedAt: { type: Date },
    },
    pointsAwarded: { type: Number, default: 0 },
    clearedAt: { type: Date },
    adminNote: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Report", reportSchema);
