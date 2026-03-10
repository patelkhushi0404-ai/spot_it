const express = require('express');
const router = express.Router();
const { raiseQuery, getMyQueries, getQueryById, addMessage, closeQuery, getAllQueries } = require('../controllers/queryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Queries
 *   description: User query and support system
 */

/**
 * @swagger
 * /api/queries:
 *   post:
 *     summary: Raise a new query
 *     tags: [Queries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [category, subject, message]
 *             properties:
 *               category:
 *                 type: string
 *                 enum: [report_issue, reward_issue, general]
 *               subject:
 *                 type: string
 *                 example: My report is stuck in pending
 *               message:
 *                 type: string
 *                 example: My report was submitted 3 days ago and still pending
 *     responses:
 *       201:
 *         description: Query raised successfully
 */
router.post('/', protect, raiseQuery);

/**
 * @swagger
 * /api/queries/my:
 *   get:
 *     summary: Get logged in user's queries
 *     tags: [Queries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's queries
 */
router.get('/my', protect, getMyQueries);

/**
 * @swagger
 * /api/queries:
 *   get:
 *     summary: Get all queries (Admin only)
 *     tags: [Queries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [open, replied, closed]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: All queries paginated
 */
router.get('/', protect, adminOnly, getAllQueries);

/**
 * @swagger
 * /api/queries/{id}:
 *   get:
 *     summary: Get single query with chat messages
 *     tags: [Queries]
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
 *         description: Query details with messages
 *       404:
 *         description: Query not found
 */
router.get('/:id', protect, getQueryById);

/**
 * @swagger
 * /api/queries/{id}/message:
 *   put:
 *     summary: Add message to query (user or admin reply)
 *     tags: [Queries]
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
 *             required: [text]
 *             properties:
 *               text:
 *                 type: string
 *                 example: Thank you for looking into this
 *     responses:
 *       200:
 *         description: Message added
 */
router.put('/:id/message', protect, addMessage);

/**
 * @swagger
 * /api/queries/{id}/close:
 *   put:
 *     summary: Close a query
 *     tags: [Queries]
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
 *         description: Query closed
 */
router.put('/:id/close', protect, closeQuery);

module.exports = router;