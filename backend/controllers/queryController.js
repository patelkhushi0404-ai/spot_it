const Query = require('../models/Query');

const raiseQuery = async (req, res, next) => {
  try {
    const { category, subject, message } = req.body;
    const query = await Query.create({
      user: req.user._id, category, subject,
      messages: [{ sender: 'user', text: message }],
    });
    res.status(201).json({ success: true, message: 'Query raised', query });
  } catch (error) { next(error); }
};

const getMyQueries = async (req, res, next) => {
  try {
    const queries = await Query.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json({ success: true, queries });
  } catch (error) { next(error); }
};

const getQueryById = async (req, res, next) => {
  try {
    const query = await Query.findById(req.params.id).populate('user', 'name email');
    if (!query) return res.status(404).json({ success: false, message: 'Query not found' });
    if (query.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, query });
  } catch (error) { next(error); }
};

const addMessage = async (req, res, next) => {
  try {
    const { text } = req.body;
    const sender = req.user.role === 'admin' ? 'admin' : 'user';
    const query = await Query.findByIdAndUpdate(
      req.params.id,
      { $push: { messages: { sender, text } }, status: sender === 'admin' ? 'replied' : 'open' },
      { new: true }
    );
    if (!query) return res.status(404).json({ success: false, message: 'Query not found' });
    res.json({ success: true, query });
  } catch (error) { next(error); }
};

const closeQuery = async (req, res, next) => {
  try {
    const query = await Query.findByIdAndUpdate(req.params.id, { status: 'closed' }, { new: true });
    if (!query) return res.status(404).json({ success: false, message: 'Query not found' });
    res.json({ success: true, message: 'Query closed', query });
  } catch (error) { next(error); }
};

const getAllQueries = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = status ? { status } : {};
    const total = await Query.countDocuments(filter);
    const queries = await Query.find(filter)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('user', 'name email');
    res.json({ success: true, total, queries });
  } catch (error) { next(error); }
};

module.exports = { raiseQuery, getMyQueries, getQueryById, addMessage, closeQuery, getAllQueries };