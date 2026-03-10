const express = require('express');
const router = express.Router();
const { getRewards, redeemReward, getRedemptionHistory, createReward, updateReward, deleteReward } = require('../controllers/rewardController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Rewards
 *   description: Reward management
 */

/**
 * @swagger
 * /api/rewards:
 *   get:
 *     summary: Get all active rewards (public)
 *     tags: [Rewards]
 *     security: []
 *     responses:
 *       200:
 *         description: List of rewards
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 rewards:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reward'
 */
router.get('/', getRewards);

/**
 * @swagger
 * /api/rewards/redeem:
 *   post:
 *     summary: Redeem a reward
 *     tags: [Rewards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rewardId]
 *             properties:
 *               rewardId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reward redeemed successfully
 *       400:
 *         description: Not enough points
 */
router.post('/redeem', protect, redeemReward);

/**
 * @swagger
 * /api/rewards/history:
 *   get:
 *     summary: Get user's redemption history
 *     tags: [Rewards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Redemption history list
 */
router.get('/history', protect, getRedemptionHistory);

/**
 * @swagger
 * /api/rewards:
 *   post:
 *     summary: Create a new reward (Admin only)
 *     tags: [Rewards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, type, pointsRequired]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Gift Voucher
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [gift_voucher, cashback, certificate]
 *               pointsRequired:
 *                 type: number
 *                 example: 100
 *     responses:
 *       201:
 *         description: Reward created
 */
router.post('/', protect, adminOnly, createReward);

/**
 * @swagger
 * /api/rewards/{id}:
 *   put:
 *     summary: Update reward (Admin only)
 *     tags: [Rewards]
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
 *             $ref: '#/components/schemas/Reward'
 *     responses:
 *       200:
 *         description: Reward updated
 */
router.put('/:id', protect, adminOnly, updateReward);

/**
 * @swagger
 * /api/rewards/{id}:
 *   delete:
 *     summary: Delete reward (Admin only)
 *     tags: [Rewards]
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
 *         description: Reward removed
 */
router.delete('/:id', protect, adminOnly, deleteReward);

module.exports = router;