const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  // Preferences
  currency: { type: String, default: 'INR' },
  language: { type: String, default: 'en-US' },
  dateFormat: { type: String, default: 'DD/MM/YYYY' },
  timezone: { type: String, default: 'UTC' },
  startOfWeek: { type: String, default: 'Monday' },
  
  // Appearance
  theme: { type: String, enum: ['light', 'dark', 'system'], default: 'light' },
  compactMode: { type: Boolean, default: false },
  animations: { type: Boolean, default: true },
  
  // Finance
  monthlyBudget: { type: Number, default: 0 },
  budgetStartDate: { type: Number, default: 1 },
  
  // Notifications
  notifications: { type: Boolean, default: true },
  emailAlerts: { type: Boolean, default: true },
  budgetAlerts: { type: Boolean, default: true },
  goalReminders: { type: Boolean, default: true },
  aiInsightsNotifications: { type: Boolean, default: true },
  
  // AI Settings
  aiInsightsEnabled: { type: Boolean, default: true },
  smartAnalysis: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
