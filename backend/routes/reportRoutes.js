const express = require('express');
const router = express.Router();
const {
  submitReport,
  getRecentReports,
  getMyReports,
  getReportById,
  getAllReports,
  assignWorker,
  changeStatus,
  markCleared,
  getDashboardStats,
} = require('../controllers/reportController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Waste report management
 */

// ===================== PUBLIC =====================

/**
 * @swagger
 * /api/reports/recent:
 *   get:
 *     summary: Get last 5 reports (public - for landing page)
 *     tags: [Reports]
 *     security: []
 *     responses:
 *       200:
 *         description: Recent 5 reports
 */
router.get('/recent', getRecentReports);


// ===================== ADMIN FIXED ROUTES (must be before /:id) =====================

/**
 * @swagger
 * /api/reports/admin/stats:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats with charts data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalReports: { type: number }
 *                     pendingReports: { type: number }
 *                     assignedReports: { type: number }
 *                     clearedReports: { type: number }
 *                     totalUsers: { type: number }
 *                     totalRewardsGiven: { type: number }
 *                     reportsPerDay: { type: array }
 */
router.get('/admin/stats', protect, adminOnly, getDashboardStats);

/**
 * @swagger
 * /api/reports/my:
 *   get:
 *     summary: Get logged in user's reports
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's reports list
 */
router.get('/my', protect, getMyReports);

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Get all reports - Admin only
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, assigned, inprogress, cleared]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated reports list
 */
router.get('/', protect, adminOnly, getAllReports);

// ===================== USER =====================

/**
 * @swagger
 * /api/reports:
 *   post:
 *     summary: Submit a new waste report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image, address, description]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               address:
 *                 type: string
 *                 example: MG Road, Anand, Gujarat
 *               lat:
 *                 type: number
 *                 example: 22.5645
 *               lng:
 *                 type: number
 *                 example: 72.9289
 *               description:
 *                 type: string
 *                 example: Large pile of garbage near the bus stop
 *     responses:
 *       201:
 *         description: Report submitted successfully
 *       400:
 *         description: Image is required
 */
router.post('/', protect, upload.single('image'), submitReport);

// ===================== ADMIN DYNAMIC ROUTES =====================

/**
 * @swagger
 * /api/reports/{id}/assign:
 *   put:
 *     summary: Assign worker to report - Admin only
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [workerName]
 *             properties:
 *               workerName:
 *                 type: string
 *                 example: Ramesh Kumar
 *     responses:
 *       200:
 *         description: Worker assigned successfully
 */
router.put('/:id/assign', protect, adminOnly, assignWorker);

/**
 * @swagger
 * /api/reports/{id}/status:
 *   put:
 *     summary: Change report status - Admin only
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, assigned, inprogress, cleared]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.put('/:id/status', protect, adminOnly, changeStatus);

/**
 * @swagger
 * /api/reports/{id}/clear:
 *   put:
 *     summary: Mark report as cleared and award points - Admin only
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               points:
 *                 type: number
 *                 example: 10
 *               adminNote:
 *                 type: string
 *                 example: Cleared by team B
 *     responses:
 *       200:
 *         description: Report cleared and points awarded
 */
router.put('/:id/clear', protect, adminOnly, (req, res, next) =>{
  console.log('Clear route hit for ID:', req.params.id);
  console.log('User:', req.user?.email);
  console.log('Body:', req.body);
  console.log('Content-Type:', req.headers['content-type']);
  next();
}, markCleared);

// ===================== SINGLE REPORT — always last =====================

/**
 * @swagger
 * /api/reports/{id}:
 *   get:
 *     summary: Get single report by ID
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report details
 *       404:
 *         description: Report not found
 */
router.get('/:id', protect, getReportById);

module.exports = router;
