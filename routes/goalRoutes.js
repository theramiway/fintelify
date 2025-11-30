const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');

// @route   POST /api/goals
// @desc    Add a new goal
// @access  Public
router.post('/', async (req, res) => {
  try {
    const newGoal = new Goal(req.body);
    const goal = await newGoal.save();
    res.status(201).json(goal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   GET /api/goals
// @desc    Get all goals
// @access  Public
router.get('/', async (req, res) => {
  try {
    // UPDATED: Changed 'targetDate' to 'deadline' to match your Model
    const goals = await Goal.find().sort({ deadline: 1 }); 
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   PUT /api/goals/:id
// @desc    Update a goal
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const goal = await Goal.findByIdAndUpdate(req.params.id, req.body, { 
      new: true, 
      runValidators: true 
    });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    res.json(goal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   DELETE /api/goals/:id
// @desc    Delete a goal
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const goal = await Goal.findByIdAndDelete(req.params.id);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    res.json({ message: 'Goal deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;