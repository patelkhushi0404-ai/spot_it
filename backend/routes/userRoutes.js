const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET PROFILE
router.get("/profile/:id", async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    res.json({
      name: user.name,
      email: user.email,
      points: user.points,
      reports: user.reports,
      rank: user.rank
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// UPDATE PROFILE
router.put("/profile/:id", async (req, res) => {
  try {

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email
      },
      { new: true }
    );

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;