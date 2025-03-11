const express = require('express');
const { likeProgress, addComment } = require('../controllers/progressController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Like a progress entry
router.post('/:id/like', requireAuth, likeProgress);

// Add a comment to a progress entry
router.post('/:id/comment', requireAuth, addComment);

module.exports = router;
