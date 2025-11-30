const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema({
  // The user's written observation/analysis
  text: {
    type: String,
    required: [true, 'Insight text is required'],
  },
  // A title for the insight
  title: {
    type: String,
    trim: true,
  },
  // Date the insight was recorded
  date: {
    type: Date,
    default: Date.now,
  },
  // Optional: Link this insight to a specific category (e.g., 'Travel Spending')
  relatedCategory: {
    type: String,
    trim: true,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Insight', insightSchema);