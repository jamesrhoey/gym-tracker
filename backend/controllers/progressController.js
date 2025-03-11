const Progress = require('../models/Progress');
const User = require('../models/User'); // Import the User model

// Like a progress entry
exports.likeProgress = async (req, res) => {
  try {
    const progress = await Progress.findById(req.params.id);
    if (!progress.likes.includes(req.user.id)) {
      progress.likes.push(req.user.id);
      await progress.save();
    }
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Failed to like progress', error: error.message });
  }
};

// Add a comment to a progress entry
exports.addComment = async (req, res) => {
  try {
    const progress = await Progress.findById(req.params.id);
    const user = await User.findById(req.user.id); // Fetch the user details

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add the comment with the username
    progress.comments.push({
      userId: req.user.id,
      username: user.username, // Include the username
      text: req.body.text,
    });

    await progress.save();
    res.status(201).json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add comment', error: error.message });
  }
};
