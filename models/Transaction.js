const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // A brief description of the transaction
  description: {
    type: String,
    required: [true, 'Transaction description is required'],
    trim: true,
  },
  // The amount of the transaction
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    // Note: Use a positive number for income and a negative for expense, or use 'type' field
  },
  // Type of transaction: 'Income' or 'Expense'
  type: {
    type: String,
    enum: ['Income', 'Expense'],
    required: [true, 'Transaction type is required'],
  },
  // Category (e.g., 'Food', 'Salary', 'Rent', 'Investment')
  category: {
    type: String,
    trim: true,
    required: false, // Optional, but highly recommended for analysis
  },
  // Date of the transaction (defaults to creation date)
  date: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);