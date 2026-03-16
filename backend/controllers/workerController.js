const Worker = require('../models/Worker');
const Report = require('../models/Report');

const addWorker = async (req, res, next) => {
  try {
    const { name, phone, area, email } = req.body;
    const worker = await Worker.create({ name, phone, area, email });
    res.status(201).json({ success: true, message: 'Worker added successfully', worker });
  } catch (error) {
    next(error);
  }
};

const getAllWorkers = async (req, res, next) => {
  try {
    const workers = await Worker.find().sort({ createdAt: -1 });
    res.json({ success: true, count: workers.length, workers });
  } catch (error) {
    next(error);
  }
};

const getWorkerById = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });
    res.json({ success: true, worker });
  } catch (error) {
    next(error);
  }
};

const updateWorker = async (req, res, next) => {
  try {
    const worker = await Worker.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });
    res.json({ success: true, message: 'Worker updated', worker });
  } catch (error) {
    next(error);
  }
};

const deleteWorker = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });

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

const toggleAvailability = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });

    worker.isActive = !worker.isActive;
    await worker.save();

    res.json({
      success: true,
      message: `Worker marked as ${worker.isActive ? 'Active' : 'Inactive'}`,
      isActive: worker.isActive,
    });
  } catch (error) {
    next(error);
  }
};

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