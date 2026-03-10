const Reward = require('../models/Reward');
const Redemption = require('../models/Redemption');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const getRewards = async (req, res, next) => {
  try {
    const rewards = await Reward.find({ isActive: true }).sort({ pointsRequired: 1 });
    res.json({ success: true, rewards });
  } catch (error) { next(error); }
};

const redeemReward = async (req, res, next) => {
  try {
    const { rewardId } = req.body;
    const reward = await Reward.findById(rewardId);
    if (!reward || !reward.isActive) return res.status(404).json({ success: false, message: 'Reward not available' });

    const user = await User.findById(req.user._id);
    if (user.totalPoints < reward.pointsRequired) {
      return res.status(400).json({ success: false, message: `Need ${reward.pointsRequired} pts, you have ${user.totalPoints}` });
    }

    user.totalPoints -= reward.pointsRequired;
    user.notifications.push({ message: `You redeemed "${reward.title}" for ${reward.pointsRequired} points!` });
    await user.save({ validateBeforeSave: false });

    const redemption = await Redemption.create({ user: user._id, reward: reward._id, pointsUsed: reward.pointsRequired });

    await sendEmail({
      to: user.email,
      subject: `SpotIT - Reward Redeemed: ${reward.title}`,
      html: `<h2>Reward Redeemed! 🎁</h2><p>Hi ${user.name}, you redeemed <strong>${reward.title}</strong> for ${reward.pointsRequired} points. Remaining: ${user.totalPoints} pts.</p>`,
    });

    res.json({ success: true, message: 'Reward redeemed!', redemption });
  } catch (error) { next(error); }
};

const getRedemptionHistory = async (req, res, next) => {
  try {
    const history = await Redemption.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('reward', 'title type pointsRequired');
    res.json({ success: true, history });
  } catch (error) { next(error); }
};

const createReward = async (req, res, next) => {
  try {
    const reward = await Reward.create(req.body);
    res.status(201).json({ success: true, reward });
  } catch (error) { next(error); }
};

const updateReward = async (req, res, next) => {
  try {
    const reward = await Reward.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!reward) return res.status(404).json({ success: false, message: 'Reward not found' });
    res.json({ success: true, reward });
  } catch (error) { next(error); }
};

const deleteReward = async (req, res, next) => {
  try {
    await Reward.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Reward removed' });
  } catch (error) { next(error); }
};

module.exports = { getRewards, redeemReward, getRedemptionHistory, createReward, updateReward, deleteReward };