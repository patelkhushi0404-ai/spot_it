const User = require('../models/User');

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password -refreshToken');
    res.json({ success: true, user });
  } catch (error) { next(error); }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    if (email && email !== req.user.email) {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ success: false, message: 'Email already in use' });
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, { name, email }, { new: true, runValidators: true }
    ).select('-password -refreshToken');
    res.json({ success: true, message: 'Profile updated', user: updatedUser });
  } catch (error) { next(error); }
};

const getNotifications = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('notifications');
    const notifications = user.notifications.sort((a, b) => b.createdAt - a.createdAt);
    res.json({ success: true, notifications });
  } catch (error) { next(error); }
};

const markNotificationRead = async (req, res, next) => {
  try {
    await User.updateOne(
      { _id: req.user._id, 'notifications._id': req.params.id },
      { $set: { 'notifications.$.read': true } }
    );
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) { next(error); }
};

module.exports = { getProfile, updateProfile, getNotifications, markNotificationRead };