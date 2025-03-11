import React, { useState, useEffect } from "react";
import axios from "axios";

const WorkoutPlan = () => {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/workouts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWorkouts(res.data);
      } catch (error) {
        console.error("Failed to fetch workouts:", error);
      }
    };
    fetchWorkouts();
  }, []);

  return (
    <div>
      <h4>📋 Your Workout Plans</h4>
      {workouts.map((workout) => (
        <div key={workout._id} className="mb-3">
          <h5>{workout.title}</h5>
          <ul>
            {workout.exercises.map((exercise) => (
              <li key={exercise._id}>{exercise.name} - {exercise.sets} sets x {exercise.reps} reps</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default WorkoutPlan;
