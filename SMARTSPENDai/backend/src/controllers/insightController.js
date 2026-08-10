const Transaction = require('../models/Transaction');
const { generateFinancialInsight } = require('../services/geminiService');

// @desc    Get AI Insights based on user transactions
// @route   GET /api/insights
// @access  Private
const getInsights = async (req, res) => {
  try {
    // 1. Identify logged-in user
    const userId = req.user.uid;

    // 2. Fetch user's transactions
    const transactions = await Transaction.find({ userId });

    if (!transactions || transactions.length === 0) {
      return res.status(200).json({
        success: true,
        insight: "Add a few income or expense transactions to receive personalized spending insights."
      });
    }

    // 3. Create a financial summary
    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryTotals = {};

    transactions.forEach(tx => {
      if (tx.amount > 0) {
        totalIncome += tx.amount;
      } else {
        const absAmount = Math.abs(tx.amount);
        totalExpenses += absAmount;
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + absAmount;
      }
    });

    const savings = totalIncome - totalExpenses;

    // Format category spending string
    let categoryString = '';
    let highestCategory = '';
    let highestAmount = 0;

    Object.entries(categoryTotals).forEach(([cat, amt]) => {
      categoryString += `${cat}: ₹${amt}\n`;
      if (amt > highestAmount) {
        highestAmount = amt;
        highestCategory = cat;
      }
    });

    const financialSummary = `
Total Income: ₹${totalIncome}
Total Expenses: ₹${totalExpenses}
Savings: ₹${savings}

Category Spending:
${categoryString}
${highestCategory ? `Highest Spending Category: ${highestCategory}` : ''}
    `.trim();

    // 4. Call Gemini Service
    const aiInsightText = await generateFinancialInsight(financialSummary);

    res.status(200).json({
      success: true,
      insight: aiInsightText
    });

  } catch (error) {
    console.error('Insight Generation Error:', error.message);
    res.status(500).json({
      success: false,
      message: "Unable to generate AI insight right now."
    });
  }
};

// @desc    Scan receipt image using Gemini Vision
// @route   POST /api/insights/scan-receipt
// @access  Private
const scanReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    const { scanReceiptImage } = require('../services/geminiService');
    const base64Data = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    const receiptData = await scanReceiptImage(base64Data, mimeType);

    res.status(200).json({
      success: true,
      data: receiptData
    });

  } catch (error) {
    console.error('Receipt Scan Error:', error.message);
    res.status(500).json({
      success: false,
      message: "Unable to scan receipt right now."
    });
  }
};

// @desc    Get AI Budget Insights based on user budgets and transactions
// @route   POST /api/insights/budgets
// @access  Private
const getBudgetInsights = async (req, res) => {
  try {
    const { budgets } = req.body;

    if (!budgets || budgets.length === 0) {
      return res.status(200).json({
        success: true,
        insights: [
          { type: 'success', text: 'Create your first budget to get personalized AI tips!' },
          { type: 'warning', text: 'Tracking your budget helps you save more money each month.' }
        ]
      });
    }

    let budgetSummary = '';
    budgets.forEach(b => {
      budgetSummary += `Category: ${b.category} | Limit: ₹${b.limit} | Spent: ₹${b.spent} | Remaining: ₹${b.limit - b.spent}\n`;
    });

    const { generateBudgetInsights } = require('../services/geminiService');
    const aiInsights = await generateBudgetInsights(budgetSummary);

    res.status(200).json({
      success: true,
      insights: aiInsights
    });
  } catch (error) {
    console.error('Budget Insight Error:', error.message);
    res.status(500).json({
      success: false,
      message: "Unable to generate budget insights right now."
    });
  }
};

module.exports = {
  getInsights,
  scanReceipt,
  getBudgetInsights
};
