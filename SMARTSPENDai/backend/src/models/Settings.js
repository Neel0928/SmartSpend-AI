const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  currency: {
    type: String,
    enum: ['INR', 'USD', 'EUR', 'GBP', 'JPY'],
    default: 'INR'
  },
  theme: {
    type: String,
    enum: ['light', 'dark', 'system'],
    default: 'light'
  },
  monthlyBudget: {
    type: Number,
    default: 0
  },
  notifications: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
