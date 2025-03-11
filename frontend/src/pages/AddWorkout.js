import React, { useState } from "react";
import axios from "axios";

const AddWorkout = () => {
  const [title, setTitle] = useState("");
  const [exercises, setExercises] = useState([{ name: "", sets: "", reps: "" }]);

  const handleAddExercise = () => {
    setExercises([...exercises, { name: "", sets: "", reps: "" }]);
  };

  const handleChange = (index, event) => {
    const newExercises = [...exercises];
    newExercises[index][event.target.name] = event.target.value;
    setExercises(newExercises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/workouts/add", // Updated API endpoint
        { title, exercises },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Workout added successfully!");
      console.log("Response:", response.data);
      // Reset form after successful submission
      setTitle("");
      setExercises([{ name: "", sets: "", reps: "" }]);
    } catch (error) {
      console.error("Error adding workout:", error.response ? error.response.data : error.message);
      alert("Failed to add workout. Check console for details.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>🏋️ Add Workout</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Workout Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        {exercises.map((exercise, index) => (
          <div key={index} className="mb-3">
            <label className="form-label">Exercise Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={exercise.name}
              onChange={(e) => handleChange(index, e)}
              required
            />
            <label className="form-label">Sets</label>
            <input
              type="number"
              className="form-control"
              name="sets"
              value={exercise.sets}
              onChange={(e) => handleChange(index, e)}
              required
            />
            <label className="form-label">Reps</label>
            <input
              type="number"
              className="form-control"
              name="reps"
              value={exercise.reps}
              onChange={(e) => handleChange(index, e)}
              required
            />
          </div>
        ))}
        <button type="button" className="btn btn-secondary me-2" onClick={handleAddExercise}>
          ➕ Add Exercise
        </button>
        <button type="submit" className="btn btn-primary">
          ✅ Save Workout
        </button>
      </form>
    </div>
  );
};

export default AddWorkout;
