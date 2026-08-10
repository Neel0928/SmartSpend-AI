const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  limit: {
    type: Number,
    required: true,
    min: 0
  },
  month: {
    type: String, // e.g. "May 2025" or "2025-05"
    required: true
  }
}, { timestamps: true });

// Ensure a user can only have one budget per category per month
budgetSchema.index({ userId: 1, category: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
