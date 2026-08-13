const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    let user = await User.findOne({ uid: req.user.uid });

    if (!user) {
      // Create user if not exists (first time login fallback)
      user = await User.create({
        uid: req.user.uid,
        email: req.user.email || ''
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const { fullName, username, phone, country, timezone, currency, avatarUrl } = req.body;
    
    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      { 
        fullName, 
        username, 
        phone, 
        country, 
        timezone, 
        currency, 
        avatarUrl 
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile
};
