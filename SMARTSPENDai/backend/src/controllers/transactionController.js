const Transaction = require('../models/Transaction');

// @desc    Get all transactions for user
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.uid }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new transaction
// @route   POST /api/transactions
// @access  Private
const addTransaction = async (req, res) => {
  try {
    const { name, amount, type, category, date, description, paymentMethod, account } = req.body;

    // Validate inputs
    if (!name || !amount || !type || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const transaction = await Transaction.create({
      userId: req.user.uid,
      name,
      amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
      type,
      category,
      date: date || Date.now(),
      description,
      paymentMethod,
      account
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Make sure user owns transaction
    if (transaction.userId !== req.user.uid) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await transaction.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTransactions,
  addTransaction,
  deleteTransaction
};
