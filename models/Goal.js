const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  // Changed from 'name' to 'title' to match your frontend form
  title: {
    type: String,
    required: [true, 'Goal title is required'],
    trim: true,
  },
  // The total amount the user wants to save
  targetAmount: {
    type: Number,
    required: [true, 'Target amount is required'],
    min: [0, 'Target amount must be a positive number'],
  },
  // Current amount saved towards the goal
  currentAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  // Changed from 'targetDate' to 'deadline' to match your frontend form
  deadline: {
    type: Date,
    required: [true, 'Deadline is required'], // Generally good to require this if your form requires it
  },
  // Status of the goal (kept this as it's useful for future features)
  status: {
    type: String,
    enum: ['In Progress', 'Completed', 'Cancelled'],
    default: 'In Progress',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Goal', goalSchema);