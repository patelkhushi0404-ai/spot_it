const Report = require('../models/Report');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const submitReport = async (req, res, next) => {
  try {
    const { address, lat, lng, description } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: 'Image is required' });

    const report = await Report.create({
      user: req.user._id,
      image: { url: req.file.path, publicId: req.file.filename },
      location: { address, coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) } },
      description,
    });

    await User.findByIdAndUpdate(req.user._id, { $inc: { totalReports: 1 } });
    res.status(201).json({ success: true, message: 'Report submitted successfully', report });
  } catch (error) { next(error); }
};

const getRecentReports = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name')
      .select('image location description status createdAt');
    res.json({ success: true, reports });
  } catch (error) { next(error); }
};

const getMyReports = async (req, res, next) => {
  try {
    const reports = await Report.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: reports.length, reports });
  } catch (error) { next(error); }
};

const getReportById = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id).populate('user', 'name email');
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, report });
  } catch (error) { next(error); }
};

const getAllReports = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { description: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
      ];
    }
    const total = await Report.countDocuments(query);
    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('user', 'name email');
    res.json({ success: true, total, page: parseInt(page), pages: Math.ceil(total / limit), reports });
  } catch (error) { next(error); }
};

const assignWorker = async (req, res, next) => {
  try {
    const { workerId } = req.body;

    // Find worker from DB
    const Worker = require('../models/Worker');
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }
    if (!worker.isAvailable) {
      return res.status(400).json({ success: false, message: 'Worker is not available' });
    }

    // Assign worker to report
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      {
        assignedWorker: {
          workerId: worker._id,
          name: worker.name,
          phone: worker.phone,
          area: worker.area,
          assignedAt: new Date(),
        },
        status: 'assigned',
      },
      { new: true }
    ).populate('user', 'name email');

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    // Increment worker's total assigned
    await Worker.findByIdAndUpdate(workerId, { $inc: { totalAssigned: 1 } });

    // Notify user
    await User.findByIdAndUpdate(report.user._id, {
      $push: {
        notifications: {
          message: `Your report at "${report.location.address}" has been assigned to worker ${worker.name}.`,
        },
      },
    });

    res.json({ success: true, message: `Report assigned to ${worker.name}`, report });
  } catch (error) {
    next(error);
  }
};


const changeStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const report = await Report.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('user', 'name email');
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, message: 'Status updated', report });
  } catch (error) { next(error); }
};

const markCleared = async (req, res, next) => {
  try {
    const { points = 10, adminNote } = req.body;

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      {
        status: 'cleared',
        pointsAwarded: points,
        clearedAt: new Date(),
        adminNote,
      },
      { new: true }
    ).populate('user', 'name email');

    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

    // Add points to user
    const user = await User.findByIdAndUpdate(
      report.user._id,
      {
        $inc: { totalPoints: points },
        $push: {
          notifications: {
            message: `Your report has been cleared! You earned ${points} points. 🎉`,
          },
        },
      },
      { new: true }
    );

    // Update worker's total cleared count
    if (report.assignedWorker?.workerId) {
      const Worker = require('../models/Worker');
      await Worker.findByIdAndUpdate(report.assignedWorker.workerId, {
        $inc: { totalCleared: 1 },
      });
    }

    // Send email to user
    await sendEmail({
      to: user.email,
      subject: 'SpotIT - Report Cleared! 🎉',
      html: `
        <h2>Great News, ${user.name}!</h2>
        <p>Your report at <strong>${report.location.address}</strong> has been cleared.</p>
        <p>You earned <strong>${points} points</strong>!</p>
        <p>Your total points: <strong>${user.totalPoints}</strong></p>
        <br/>
        <a href="${process.env.CLIENT_URL}/rewards" 
           style="background:#16a34a;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
          View Rewards
        </a>
      `,
    });

    res.json({ success: true, message: `Cleared. ${points} points added.`, report });
  } catch (error) {
    next(error);
  }
};


const getDashboardStats = async (req, res, next) => {
  try {
    const [totalReports, pendingReports, assignedReports, clearedReports, totalUsers] = await Promise.all([
      Report.countDocuments(),
      Report.countDocuments({ status: 'pending' }),
      Report.countDocuments({ status: 'assigned' }),
      Report.countDocuments({ status: 'cleared' }),
      User.countDocuments({ role: 'user' }),
    ]);

    const pointsResult = await Report.aggregate([
      { $match: { status: 'cleared' } },
      { $group: { _id: null, totalPoints: { $sum: '$pointsAwarded' } } },
    ]);
    const totalRewardsGiven = pointsResult[0]?.totalPoints || 0;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const reportsPerDay = await Report.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({ success: true, stats: { totalReports, pendingReports, assignedReports, clearedReports, totalUsers, totalRewardsGiven, reportsPerDay } });
  } catch (error) { next(error); }
};

module.exports = { submitReport, getRecentReports, getMyReports, getReportById, getAllReports, assignWorker, changeStatus, markCleared, getDashboardStats };