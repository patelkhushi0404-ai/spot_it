const express = require('express');
const router = express.Router();
const { getAllUsers, toggleUserStatus, addPointsToUser, exportReports } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management actions
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: All users list
 */
router.get('/users', protect, adminOnly, getAllUsers);

/**
 * @swagger
 * /api/admin/users/{id}/toggle:
 *   put:
 *     summary: Block or unblock a user (Admin only)
 *     tags: [Admin]
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
 *         description: User status toggled
 */
router.put('/users/:id/toggle', protect, adminOnly, toggleUserStatus);

/**
 * @swagger
 * /api/admin/users/{id}/points:
 *   put:
 *     summary: Manually add points to a user (Admin only)
 *     tags: [Admin]
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
 *             required: [points]
 *             properties:
 *               points:
 *                 type: number
 *                 example: 50
 *               reason:
 *                 type: string
 *                 example: Bonus for active reporting
 *     responses:
 *       200:
 *         description: Points added successfully
 */
router.put('/users/:id/points', protect, adminOnly, addPointsToUser);

/**
 * @swagger
 * /api/admin/export/reports:
 *   get:
 *     summary: Export all reports as CSV (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file download
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 */
router.get('/export/reports', protect, adminOnly, exportReports);

module.exports = router;
