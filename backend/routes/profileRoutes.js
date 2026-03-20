const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { getProfile, updateProfile, getNotifications, markNotificationRead, getProfileStats } = require('../controllers/profileController');
/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile management
 */

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get logged in user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */
router.get('/', protect, getProfile);

/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put('/', protect, updateProfile);

/**
 * @swagger
 * /api/profile/notifications:
 *   get:
 *     summary: Get user notifications
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 */
router.get('/notifications', protect, getNotifications);

/**
 * @swagger
 * /api/profile/notifications/{id}/read:
 *   put:
 *     summary: Mark notification as read
 *     tags: [Profile]
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
 *         description: Notification marked as read
 */
router.put('/notifications/:id/read', protect, markNotificationRead);
router.get('/stats', protect, getProfileStats);

module.exports = router;