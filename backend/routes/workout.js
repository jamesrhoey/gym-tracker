const express = require('express');
const { addWorkout, getWorkouts } = require('../controllers/workoutController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', requireAuth, addWorkout);
router.get('/', requireAuth, getWorkouts);

module.exports = router;
