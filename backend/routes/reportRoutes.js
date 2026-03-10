const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const { createReport } = require("../controllers/reportController");

// storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// API route
router.post("/create", upload.single("image"), createReport);

module.exports = router;