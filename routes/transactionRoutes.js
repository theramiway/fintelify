const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// @route   POST /api/transactions
// @desc    Add a new transaction
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { description, amount, type, category } = req.body;

    // 1. Basic Validation
    if (!description || !amount || !type) {
      return res.status(400).json({ message: 'Please provide description, amount, and type' });
    }

    // 2. Logic: Make amount negative if it's an Expense
    // This makes calculating the "Total Balance" on the frontend very easy.
    const finalAmount = type === 'Expense' ? -Math.abs(amount) : Math.abs(amount);

    const newTransaction = new Transaction({
      description,
      amount: finalAmount,
      type,
      category
    });

    const transaction = await newTransaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   GET /api/transactions
// @desc    Get recent transactions
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Get the most recent 20 transactions, sorted by date descending (newest first)
    const transactions = await Transaction.find()
      .sort({ date: -1 }) 
      .limit(20); 
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   DELETE /api/transactions/:id  <-- ADDED THIS
// @desc    Delete a transaction
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;