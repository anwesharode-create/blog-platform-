const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

/**
 * GET /api/blogs
 * supports: ?search=&category=&page=&limit=
 */
const getBlogs = async (req, res) => {
  try {
    const { search = '', category = '', page = 1, limit = 9 } = req.query;
    const query = {};
    if (search) query.title = { $regex: search, $options: 'i' };
    if (category) query.category = category;

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Blog.find(query).populate('author', 'name').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Blog.countDocuments(query),
    ]);

    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/blogs/:id
 * returns blog + comments
 */
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name email');
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const comments = await Comment.find({ blog: blog._id }).populate('user', 'name').sort({ createdAt: -1 });
    res.json({ blog, comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /api/blogs
 * protected, accepts multipart form with optional file
 */
const createBlog = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content || !category) return res.status(400).json({ message: 'Title, content, category required' });

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const blog = new Blog({
      title,
      content,
      category,
      imageUrl,
      author: req.user._id,
    });

    await blog.save();
    const populated = await blog.populate('author', 'name email');
    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * PUT /api/blogs/:id
 * protected, author-only, optional file update
 */
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    blog.title = req.body.title ?? blog.title;
    blog.content = req.body.content ?? blog.content;
    blog.category = req.body.category ?? blog.category;

    // If new image uploaded, delete old one
    if (req.file) {
      if (blog.imageUrl && blog.imageUrl.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '../../', blog.imageUrl);
        fs.unlink(oldPath, err => { if (err) console.warn(err); });
      }
      blog.imageUrl = `/uploads/${req.file.filename}`;
    }

    await blog.save();
    const populated = await blog.populate('author', 'name email');
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE /api/blogs/:id
 * protected, author-only
 */
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    // Delete uploaded image
    if (blog.imageUrl && blog.imageUrl.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '../../', blog.imageUrl);
      fs.unlink(filePath, err => { if (err) console.warn(err); });
    }

    await blog.deleteOne();
    await Comment.deleteMany({ blog: blog._id });

    res.json({ message: 'Blog removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /api/blogs/:id/like
 * toggles like
 */
const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const uid = req.user._id.toString();
    const idx = blog.likes.findIndex(x => x.toString() === uid);
    if (idx >= 0) blog.likes.splice(idx, 1);
    else blog.likes.push(req.user._id);

    await blog.save();
    res.json({ likes: blog.likes.length, liked: idx < 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /api/blogs/:id/save
 * toggles save for user
 */
const saveBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const user = await User.findById(req.user._id);
    const idx = user.saved.findIndex(x => x.toString() === blog._id.toString());
    if (idx >= 0) user.saved.splice(idx, 1);
    else user.saved.push(blog._id);

    await user.save();
    res.json({ saved: idx < 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getBlogs,
  getBlogById,   
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  saveBlog,
};
