const express = require('express');
const { 
  addWorkout, 
  getWorkouts, 
  getTodayStats, 
  getWorkoutReport 
} = require('../controllers/workoutController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', requireAuth, addWorkout);
router.get('/', requireAuth, getWorkouts);
router.get('/stats/today', requireAuth, getTodayStats);
router.get('/report', requireAuth, getWorkoutReport);

module.exports = router;
