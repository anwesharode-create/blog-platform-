const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/blogController');

const multer = require('multer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ---------- ROUTES ----------

// Create blog
router.post('/', protect, upload.single('image'), ctrl.createBlog);

// Update blog
router.put('/:id', protect, upload.single('image'), ctrl.updateBlog);

// Get all blogs (with pagination, search, category)
router.get('/', ctrl.getBlogs);

// Get single blog by id
router.get('/:id', ctrl.getBlogById);

// Delete blog
router.delete('/:id', protect, ctrl.deleteBlog);

// Like blog
router.post('/:id/like', protect, ctrl.likeBlog);


// Save blog
router.put('/:id/save', protect, ctrl.saveBlog);

module.exports = router;
