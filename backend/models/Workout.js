const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  exercises: [{ name: String, sets: Number, reps: Number }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Workout', WorkoutSchema);
