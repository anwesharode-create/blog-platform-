const router = require('express').Router();
const { getProfile, getUserBlogs, getSavedBlogs } = require('../controllers/userController');

router.get('/:id', getProfile);
router.get('/:id/blogs', getUserBlogs);
router.get('/:id/saved', getSavedBlogs);

module.exports = router;
