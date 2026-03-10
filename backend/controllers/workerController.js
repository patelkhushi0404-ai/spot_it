const Worker = require('../models/Worker');
const Report = require('../models/Report');

// @desc    Add new worker
// @route   POST /api/workers
// @access  Private/Admin
const addWorker = async (req, res, next) => {
  try {
    const { name, phone, area } = req.body;

    const worker = await Worker.create({ name, phone, area });
    res.status(201).json({ success: true, message: 'Worker added successfully', worker });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all workers
// @route   GET /api/workers
// @access  Private/Admin
const getAllWorkers = async (req, res, next) => {
  try {
    const workers = await Worker.find().sort({ createdAt: -1 });
    res.json({ success: true, count: workers.length, workers });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single worker
// @route   GET /api/workers/:id
// @access  Private/Admin
const getWorkerById = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });
    res.json({ success: true, worker });
  } catch (error) {
    next(error);
  }
};

// @desc    Update worker
// @route   PUT /api/workers/:id
// @access  Private/Admin
const updateWorker = async (req, res, next) => {
  try {
    const worker = await Worker.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });
    res.json({ success: true, message: 'Worker updated', worker });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete worker
// @route   DELETE /api/workers/:id
// @access  Private/Admin
const deleteWorker = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });

    // Check if worker has active assigned reports
    const activeReports = await Report.countDocuments({
      'assignedWorker.workerId': req.params.id,
      status: { $in: ['assigned', 'inprogress'] },
    });

    if (activeReports > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete. Worker has ${activeReports} active report(s) assigned.`,
      });
    }

    await Worker.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Worker deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle worker availability
// @route   PUT /api/workers/:id/toggle
// @access  Private/Admin
const toggleAvailability = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });

    worker.isAvailable = !worker.isAvailable;
    await worker.save();

    res.json({
      success: true,
      message: `Worker marked as ${worker.isAvailable ? 'Available' : 'Unavailable'}`,
      isAvailable: worker.isAvailable,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reports assigned to a worker
// @route   GET /api/workers/:id/reports
// @access  Private/Admin
const getWorkerReports = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });

    const reports = await Report.find({ 'assignedWorker.workerId': req.params.id })
      .sort({ createdAt: -1 })
      .populate('user', 'name email');

    res.json({ success: true, worker: worker.name, count: reports.length, reports });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addWorker,
  getAllWorkers,
  getWorkerById,
  updateWorker,
  deleteWorker,
  toggleAvailability,
  getWorkerReports,
};