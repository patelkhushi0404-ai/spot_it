const express = require('express');
const router = express.Router();
const {
  addWorker,
  getAllWorkers,
  getWorkerById,
  updateWorker,
  deleteWorker,
  toggleAvailability,
  getWorkerReports,
} = require('../controllers/workerController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Workers
 *   description: Worker management by admin
 */

/**
 * @swagger
 * /api/workers:
 *   post:
 *     summary: Add a new worker
 *     tags: [Workers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ramesh Kumar
 *               phone:
 *                 type: string
 *                 example: 9876543210
 *               area:
 *                 type: string
 *                 example: Anand City
 *     responses:
 *       201:
 *         description: Worker added successfully
 */
router.post('/', protect, adminOnly, addWorker);

/**
 * @swagger
 * /api/workers:
 *   get:
 *     summary: Get all workers
 *     tags: [Workers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all workers
 */
router.get('/', protect, adminOnly, getAllWorkers);

/**
 * @swagger
 * /api/workers/{id}:
 *   get:
 *     summary: Get single worker
 *     tags: [Workers]
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
 *         description: Worker details
 */
router.get('/:id', protect, adminOnly, getWorkerById);

/**
 * @swagger
 * /api/workers/{id}:
 *   put:
 *     summary: Update worker details
 *     tags: [Workers]
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
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               area:
 *                 type: string
 *     responses:
 *       200:
 *         description: Worker updated
 */
router.put('/:id', protect, adminOnly, updateWorker);

/**
 * @swagger
 * /api/workers/{id}:
 *   delete:
 *     summary: Delete a worker
 *     tags: [Workers]
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
 *         description: Worker deleted
 *       400:
 *         description: Worker has active reports
 */
router.delete('/:id', protect, adminOnly, deleteWorker);

/**
 * @swagger
 * /api/workers/{id}/toggle:
 *   put:
 *     summary: Toggle worker availability
 *     tags: [Workers]
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
 *         description: Availability toggled
 */
router.put('/:id/toggle', protect, adminOnly, toggleAvailability);

/**
 * @swagger
 * /api/workers/{id}/reports:
 *   get:
 *     summary: Get all reports assigned to a worker
 *     tags: [Workers]
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
 *         description: Worker's assigned reports
 */
router.get('/:id/reports', protect, adminOnly, getWorkerReports);

module.exports = router;