const express = require("express");
const router = express.Router();

const { createReport } = require("../controllers/reportController");
const upload = require("../middleware/upload");

router.post("/create", upload.single("image"), createReport);

module.exports = router;