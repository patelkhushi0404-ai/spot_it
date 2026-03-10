const User = require('../models/User');
const Report = require('../models/Report');
const { Parser } = require('json2csv');

const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = { role: 'user' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password -refreshToken -resetPasswordToken')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json({ success: true, total, users });
  } catch (error) { next(error); }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, message: `User ${user.isActive ? 'unblocked' : 'blocked'}`, isActive: user.isActive });
  } catch (error) { next(error); }
};

const addPointsToUser = async (req, res, next) => {
  try {
    const { points, reason } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { totalPoints: points },
        $push: { notifications: { message: `Admin added ${points} points. Reason: ${reason || 'Manual'}` } },
      },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: `${points} points added`, totalPoints: user.totalPoints });
  } catch (error) { next(error); }
};

const exportReports = async (req, res, next) => {
  try {
    const reports = await Report.find().populate('user', 'name email').sort({ createdAt: -1 }).lean();
    const data = reports.map((r) => ({
      ID: r._id,
      User: r.user?.name || 'N/A',
      Email: r.user?.email || 'N/A',
      Location: r.location?.address || '',
      Description: r.description,
      Status: r.status,
      Worker: r.assignedWorker?.name || '',
      'Points Awarded': r.pointsAwarded,
      'Submitted At': new Date(r.createdAt).toLocaleString(),
      'Cleared At': r.clearedAt ? new Date(r.clearedAt).toLocaleString() : '',
    }));
    const parser = new Parser();
    const csv = parser.parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment('spotit_reports.csv');
    res.send(csv);
  } catch (error) { next(error); }
};

module.exports = { getAllUsers, toggleUserStatus, addPointsToUser, exportReports };