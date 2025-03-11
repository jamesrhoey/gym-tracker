require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");
const workoutRoutes = require("./routes/workouts");
const progressRoutes = require("./routes/progress");
const profileRoutes = require("./routes/profile"); // ✅ Add profile routes

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/progress", uploadRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/profile", profileRoutes); // ✅ Add profile routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
