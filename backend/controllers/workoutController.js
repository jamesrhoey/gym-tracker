const Workout = require('../models/Workout');

// Add a workout
exports.addWorkout = async (req, res) => {
  try {
    const { title, exercises } = req.body;
    const newWorkout = new Workout({ userId: req.user.id, title, exercises });
    await newWorkout.save();
    res.status(201).json({ message: 'Workout added', newWorkout });
  } catch (error) {
    res.status(500).json({ message: 'Error adding workout', error });
  }
};

// Get all workouts for a user
exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workouts', error });
  }
};

// Get today's workout stats (total sets & reps)
exports.getTodayStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const workouts = await Workout.find({
      userId: req.user.id,
      createdAt: { $gte: today },
    });

    let totalSets = 0;
    let totalReps = 0;
    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        totalSets += exercise.sets;
        totalReps += exercise.reps;
      });
    });

    res.json({ totalSets, totalReps });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error });
  }
};

// Get weekly & monthly workout reports
exports.getWorkoutReport = async (req, res) => {
  try {
    const { period } = req.query; // "weekly" or "monthly"
    const now = new Date();
    let startDate;

    if (period === "weekly") {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (period === "monthly") {
      startDate = new Date(now.setMonth(now.getMonth() - 1));
    } else {
      return res.status(400).json({ message: "Invalid period. Use 'weekly' or 'monthly'." });
    }

    const workouts = await Workout.find({
      userId: req.user.id,
      createdAt: { $gte: startDate },
    });

    let totalWorkouts = workouts.length;
    let totalSets = 0;
    let totalReps = 0;

    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        totalSets += exercise.sets;
        totalReps += exercise.reps;
      });
    });

    res.json({ period, totalWorkouts, totalSets, totalReps });
  } catch (error) {
    res.status(500).json({ message: 'Error generating report', error });
  }
};
