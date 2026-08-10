const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// Helper to get date boundaries
const getDateBoundaries = (range) => {
  const now = new Date();
  let startDate = new Date();
  
  if (range === 'month') {
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);
  } else if (range === '3months') {
    startDate.setMonth(startDate.getMonth() - 3);
  } else if (range === 'year') {
    startDate.setFullYear(startDate.getFullYear() - 1);
  } else {
    // Default to this month
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);
  }
  
  return { start: startDate, end: now };
};

exports.getCategoryBreakdown = async (req, res) => {
  try {
    const { range = 'month' } = req.query;
    const { start, end } = getDateBoundaries(range);

    const breakdown = await Transaction.aggregate([
      {
        $match: {
          userId: req.user.uid,
          type: 'expense',
          date: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: { $abs: '$amount' } }
        }
      },
      {
        $sort: { total: -1 }
      },
      {
        $project: {
          category: '$_id',
          total: 1,
          _id: 0
        }
      }
    ]);

    res.json(breakdown);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getMonthlyTrend = async (req, res) => {
  try {
    // Force range to 'year' for trend to have meaningful data
    const { start, end } = getDateBoundaries('year');

    const trends = await Transaction.aggregate([
      {
        $match: {
          userId: req.user.uid,
          date: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          income: {
            $sum: {
              $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0]
            }
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ['$type', 'expense'] }, { $abs: '$amount' }, 0]
            }
          }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      },
      {
        $project: {
          year: '$_id.year',
          month: '$_id.month',
          income: 1,
          expense: 1,
          _id: 0
        }
      }
    ]);

    res.json(trends);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
