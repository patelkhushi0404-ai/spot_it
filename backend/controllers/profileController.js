const User = require('../models/User');
const Report = require('../models/Report');

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

const getProfileStats = async (req, res, next) => {
  try {
    const reports = await Report.find({ user: req.user._id });

    // Status breakdown
    const statusBreakdown = [
      { name: 'Pending', value: reports.filter(r => r.status === 'pending').length, color: '#f59e0b' },
      { name: 'Assigned', value: reports.filter(r => r.status === 'assigned').length, color: '#3b82f6' },
      { name: 'In Progress', value: reports.filter(r => r.status === 'inprogress').length, color: '#f97316' },
      { name: 'Cleared', value: reports.filter(r => r.status === 'cleared').length, color: '#22c55e' },
    ];

    // Reports per month (last 6 months)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toLocaleString('en-IN', { month: 'short' });
      const year = date.getFullYear();
      const count = reports.filter(r => {
        const d = new Date(r.createdAt);
        return d.getMonth() === date.getMonth() && d.getFullYear() === year;
      }).length;
      monthlyData.push({ month, count });
    }

    // Points earned per month
    const pointsData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toLocaleString('en-IN', { month: 'short' });
      const year = date.getFullYear();
      const points = reports
        .filter(r => {
          const d = new Date(r.createdAt);
          return d.getMonth() === date.getMonth() && d.getFullYear() === year && r.status === 'cleared';
        })
        .reduce((sum, r) => sum + (r.pointsAwarded || 0), 0);
      pointsData.push({ month, points });
    }

    res.json({
      success: true,
      stats: {
        totalReports: reports.length,
        clearedReports: reports.filter(r => r.status === 'cleared').length,
        pendingReports: reports.filter(r => r.status === 'pending').length,
        totalPoints: req.user.totalPoints || 0,
        statusBreakdown,
        monthlyData,
        pointsData,
      }
    });
  } catch (error) { next(error); }
};

module.exports = { getProfile, updateProfile, getNotifications, markNotificationRead, getProfileStats };