const Settings = require('../models/Settings');

exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ userId: req.user.uid });
    
    if (!settings) {
      settings = await Settings.create({ userId: req.user.uid });
    }
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { currency, theme, monthlyBudget, notifications } = req.body;
    
    const updateData = {};
    if (currency !== undefined) updateData.currency = currency;
    if (theme !== undefined) updateData.theme = theme;
    if (monthlyBudget !== undefined) updateData.monthlyBudget = monthlyBudget;
    if (notifications !== undefined) updateData.notifications = notifications;

    const settings = await Settings.findOneAndUpdate(
      { userId: req.user.uid },
      updateData,
      { new: true, upsert: true } // upsert ensures it creates if it doesn't exist
    );

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
