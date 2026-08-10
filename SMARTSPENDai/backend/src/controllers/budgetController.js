const Budget = require('../models/Budget');

// @desc    Get all budgets for user
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.uid }).sort({ createdAt: -1 });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new budget
// @route   POST /api/budgets
// @access  Private
const createBudget = async (req, res) => {
  try {
    const { category, limit, month } = req.body;

    if (!category || !limit || !month) {
      return res.status(400).json({ message: 'Please provide category, limit, and month' });
    }

    const budget = await Budget.create({
      userId: req.user.uid,
      category,
      limit,
      month
    });

    res.status(201).json(budget);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A budget for this category and month already exists' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a budget
// @route   PUT /api/budgets/:id
// @access  Private
const updateBudget = async (req, res) => {
  try {
    let budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Make sure user owns budget
    if (budget.userId !== req.user.uid) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    budget = await Budget.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Make sure user owns budget
    if (budget.userId !== req.user.uid) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await budget.deleteOne();

    res.json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget
};
