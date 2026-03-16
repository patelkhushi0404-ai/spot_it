const express = require('express');
const router = express.Router();
const {
  getRewards,
  redeemReward,
  getRedemptionHistory,
  getAllRedemptions,
  createReward,
  updateReward,
  deleteReward,
} = require('../controllers/rewardController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getRewards);
router.post('/redeem', protect, redeemReward);
router.get('/history', protect, getRedemptionHistory);
router.get('/all-redemptions', protect, adminOnly, getAllRedemptions);
router.post('/', protect, adminOnly, createReward);
router.put('/:id', protect, adminOnly, updateReward);
router.delete('/:id', protect, adminOnly, deleteReward);

module.exports = router;