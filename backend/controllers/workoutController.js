const Workout = require('../models/Workout');

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

exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workouts', error });
  }
};
