const Report = require("../models/Report");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const submitReport = async (req, res, next) => {
  try {
    const { address, lat, lng, description } = req.body;
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });

    // AI Analysis
    const analyzeWaste = require("../utils/analyzeWaste");
    let aiAnalysis = null;
    try {
      const result = await analyzeWaste(req.file.path);
      if (result.success) aiAnalysis = result.analysis;
    } catch (aiError) {
      console.log("AI analysis failed:", aiError.message);
    }

    const report = await Report.create({
      user: req.user._id,
      image: { url: req.file.path, publicId: req.file.filename },
      location: {
        address,
        coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) },
      },
      description,
      aiAnalysis,
    });

    await User.findByIdAndUpdate(req.user._id, { $inc: { totalReports: 1 } });
    res
      .status(201)
      .json({
        success: true,
        message: "Report submitted successfully",
        report,
      });
  } catch (error) {
    next(error);
  }
};
const getRecentReports = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name")
      .select("image location description status createdAt");
    res.json({ success: true, reports });
  } catch (error) {
    next(error);
  }
};

const getMyReports = async (req, res, next) => {
  try {
    const reports = await Report.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, count: reports.length, reports });
  } catch (error) {
    next(error);
  }
};

const getReportById = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id).populate(
      "user",
      "name email",
    );
    if (!report)
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    res.json({ success: true, report });
  } catch (error) {
    next(error);
  }
};

const getAllReports = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 100, search } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { description: { $regex: search, $options: "i" } },
        { "location.address": { $regex: search, $options: "i" } },
      ];
    }
    const total = await Report.countDocuments(query);
    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("user", "name email");
    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      reports,
    });
  } catch (error) {
    next(error);
  }
};

const assignWorker = async (req, res, next) => {
  try {
    const { workerId } = req.body;
    const Worker = require("../models/Worker");
    const worker = await Worker.findById(workerId);
    if (!worker)
      return res
        .status(404)
        .json({ success: false, message: "Worker not found" });
    if (!worker.isActive)
      return res
        .status(400)
        .json({ success: false, message: "Worker is not active" });

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
        status: "assigned",
      },
      { new: true },
    ).populate("user", "name email");

    if (!report)
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });

    await Worker.findByIdAndUpdate(workerId, { $inc: { totalAssigned: 1 } });
    await User.findByIdAndUpdate(report.user._id, {
      $push: {
        notifications: {
          message: `Your report at "${report.location.address}" has been assigned to worker ${worker.name}.`,
        },
      },
    });

    res.json({
      success: true,
      message: `Report assigned to ${worker.name}`,
      report,
    });
  } catch (error) {
    next(error);
  }
};

const changeStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    ).populate("user", "name email");
    if (!report)
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    res.json({ success: true, message: "Status updated", report });
  } catch (error) {
    next(error);
  }
};

const markCleared = async (req, res, next) => {
  try {
    const points = req.body ? Number(req.body.points) || 10 : 10;
    const adminNote = req.body ? req.body.adminNote || "" : "";

    const report = await Report.findById(req.params.id).populate(
      "user",
      "name email _id",
    );
    if (!report)
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    if (!report.user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    report.status = "cleared";
    report.pointsAwarded = points;
    report.clearedAt = new Date();
    if (adminNote) report.adminNote = adminNote;
    await report.save();

    await User.findByIdAndUpdate(report.user._id, {
      $inc: { totalPoints: points },
      $push: {
        notifications: {
          message: `Your report has been cleared! You earned ${points} points.`,
        },
      },
    });

    if (report.assignedWorker && report.assignedWorker.workerId) {
      const Worker = require("../models/Worker");
      await Worker.findByIdAndUpdate(report.assignedWorker.workerId, {
        $inc: { totalCleared: 1 },
      });
    }

    try {
      await sendEmail({
        to: report.user.email,
        subject: "🎉 Congratulations! Your Report Has Been Cleared - SpotIT",
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg,#16a34a,#15803d);padding:40px 30px;text-align:center;">
      <div style="font-size:50px;margin-bottom:10px;">🎉</div>
      <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:800;letter-spacing:1px;">Congratulations!</h1>
      <p style="color:#bbf7d0;margin:8px 0 0;font-size:16px;font-weight:600;">Your Report Has Been Cleared!</p>
    </div>
    <div style="padding:35px 30px;">
      <p style="color:#1e293b;font-size:16px;margin:0 0 20px;">Hi <strong>${report.user.name}</strong> 👋,</p>
      <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 25px;">
        Congratulations <strong>${report.user.name}</strong>! 🎊 Your waste report has been 
        <strong style="color:#16a34a;">successfully cleared</strong> by our team. 
        You are making a real difference in keeping your community clean and green!
      </p>
      <div style="background:linear-gradient(135deg,#fff7ed,#fef3c7);border:2px solid #fbbf24;border-radius:12px;padding:20px;text-align:center;margin:0 0 25px;">
        <p style="color:#92400e;font-size:13px;margin:0 0 5px;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Points Earned</p>
        <p style="color:#f59e0b;font-size:48px;font-weight:900;margin:0;line-height:1;">+${points}</p>
        <p style="color:#92400e;font-size:13px;margin:5px 0 0;">⭐ Points added to your account</p>
      </div>
      <div style="background:#f8fafc;border-radius:12px;padding:20px;margin:0 0 25px;border:1px solid #e2e8f0;">
        <p style="color:#64748b;font-size:13px;font-weight:700;margin:0 0 12px;text-transform:uppercase;letter-spacing:1px;">Report Details</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="color:#94a3b8;font-size:13px;padding:5px 0;width:40%;">📍 Location</td>
            <td style="color:#1e293b;font-size:13px;padding:5px 0;font-weight:600;">${report.location?.address || "N/A"}</td>
          </tr>
          <tr>
            <td style="color:#94a3b8;font-size:13px;padding:5px 0;">🏆 Status</td>
            <td style="color:#16a34a;font-size:13px;padding:5px 0;font-weight:600;">Cleared ✓</td>
          </tr>
        </table>
      </div>
      <div style="text-align:center;margin:0 0 25px;">
        <a href="${process.env.CLIENT_URL}/rewards" 
           style="display:inline-block;background:linear-gradient(135deg,#f97316,#ea580c);color:#ffffff;text-decoration:none;padding:14px 35px;border-radius:50px;font-weight:700;font-size:15px;letter-spacing:0.5px;">
          🎁 Redeem Your Points
        </a>
      </div>
      <p style="color:#94a3b8;font-size:13px;text-align:center;line-height:1.6;margin:0;">
        Keep spotting waste to earn more points and make your city cleaner! 🌱
      </p>
    </div>
    <div style="background:#0f172a;padding:20px 30px;text-align:center;">
      <p style="color:#475569;font-size:13px;margin:0 0 5px;">
        <strong style="color:#fb923c;">SpotIT</strong> — Waste Reporting Platform
      </p>
      <p style="color:#334155;font-size:12px;margin:0;">Making cities cleaner, one report at a time 🌍</p>
    </div>
  </div>
</body>
</html>`,
      });
    } catch (emailError) {
      console.log("Email failed:", emailError.message);
    }

    res.json({
      success: true,
      message: `Cleared. ${points} points added.`,
      report,
    });
  } catch (error) {
    console.error("markCleared error:", error.message, error.stack);
    next(error);
  }
};

const getDashboardStats = async (req, res, next) => {
  try {
    const [total, pending, assigned, inprogress, cleared, totalUsers] =
      await Promise.all([
        Report.countDocuments(),
        Report.countDocuments({ status: "pending" }),
        Report.countDocuments({ status: "assigned" }),
        Report.countDocuments({ status: "inprogress" }),
        Report.countDocuments({ status: "cleared" }),
        User.countDocuments({ role: "user" }),
      ]);

    const pointsResult = await Report.aggregate([
      { $match: { status: "cleared" } },
      { $group: { _id: null, totalPoints: { $sum: "$pointsAwarded" } } },
    ]);
    const totalRewardsGiven = pointsResult[0]?.totalPoints || 0;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const reportsPerDay = await Report.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      stats: {
        total,
        pending,
        assigned,
        inprogress,
        cleared,
        totalUsers,
        totalRewardsGiven,
        reportsPerDay,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitReport,
  getRecentReports,
  getMyReports,
  getReportById,
  getAllReports,
  assignWorker,
  changeStatus,
  markCleared,
  getDashboardStats,
};
