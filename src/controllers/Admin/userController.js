const User = require("../../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email address')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
  }
};
