const User = require('../models/User');
const Blog = require('../models/Blog');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getUserBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.params.id }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getSavedBlogs = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('saved');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.saved);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
