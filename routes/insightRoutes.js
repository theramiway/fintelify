const express = require('express');
const router = express.Router();
const Insight = require('../models/Insight');

// @route   POST /api/insights
// @desc    Add a new spending insight
// @access  Public
router.post('/', async (req, res) => {
  try {
    // req.body automatically includes text, title, date, and relatedCategory
    // because your Frontend sends them with the exact same names.
    const newInsight = new Insight(req.body);
    const insight = await newInsight.save();
    res.status(201).json(insight);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   GET /api/insights
// @desc    Get all insights
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Sort by 'date' in descending order (-1) so newest entries appear first
    const insights = await Insight.find().sort({ date: -1 });
    res.json(insights);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   DELETE /api/insights/:id   <--- ADDED THIS ROUTE
// @desc    Delete an insight by ID
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const insight = await Insight.findByIdAndDelete(req.params.id);
    if (!insight) return res.status(404).json({ message: 'Insight not found' });
    res.json({ message: 'Insight deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;