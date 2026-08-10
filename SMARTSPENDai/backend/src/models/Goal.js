const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 0.01 // must be strictly greater than 0
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: 0 // must never be negative
  },
  deadline: {
    type: Date
  },
  color: {
    type: String,
    enum: ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500'],
    default: 'bg-blue-500'
  },
  icon: {
    type: String,
    enum: ['car', 'plane', 'home', 'laptop', 'gift', 'wallet', 'graduation-cap', 'heart'],
    default: 'wallet'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'expired'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Goal', goalSchema);
