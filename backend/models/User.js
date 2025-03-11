const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: "" }, // URL to the profile picture
  workoutGoals: { type: String, default: "" }, // User's workout goals
  bio: { type: String, default: "" }, // User's bio
});

module.exports = mongoose.model("User", UserSchema);
