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
    const updateData = req.body;
    
    // Prevent overriding userId
    delete updateData.userId;

    const settings = await Settings.findOneAndUpdate(
      { userId: req.user.uid },
      { $set: updateData },
      { new: true, upsert: true } // upsert ensures it creates if it doesn't exist
    );

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
