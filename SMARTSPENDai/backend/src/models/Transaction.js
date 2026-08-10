const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true // Index for faster queries per user
  },
  name: {
    type: String,
    required: [true, 'Please add a transaction name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Please add a positive or negative number']
  },
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense']
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  paymentMethod: {
    type: String,
    default: 'Debit Card'
  },
  account: {
    type: String,
    default: 'Main Account'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
