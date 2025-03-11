import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [latestProgress, setLatestProgress] = useState(null);
  const [latestWorkout, setLatestWorkout] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchLatestProgress(token);
      fetchLatestWorkout(token);
    }
  }, []);

  const fetchLatestProgress = async (token) => {
    try {
      const res = await axios.get("http://localhost:5000/api/progress/files", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.length > 0) {
        setLatestProgress(res.data[res.data.length - 1]); // Get the latest one
      }
    } catch (error) {
      console.error("Failed to fetch progress:", error);
    }
  };

  const fetchLatestWorkout = async (token) => {
    try {
      const res = await axios.get("http://localhost:5000/api/workouts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.length > 0) {
        setLatestWorkout(res.data[res.data.length - 1]); // Get the latest one
      }
    } catch (error) {
      console.error("Failed to fetch workouts:", error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("bg-dark");
    document.body.classList.toggle("text-light");
  };

  const handleLike = async (progressId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/progress/${progressId}/like`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLatestProgress(token); // Refresh the latest progress
    } catch (error) {
      console.error("Failed to like progress:", error);
    }
  };

  const handleComment = async (progressId, text) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/progress/${progressId}/comment`, { text }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLatestProgress(token); // Refresh the latest progress
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="text-center">🏋️‍♂️ Gym Progress Tracker</h2>
        <button onClick={toggleDarkMode} className="btn btn-secondary">
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* Latest Uploaded Progress */}
      <div className="mb-4 mt-4">
        <h4>📸 Latest Uploaded Progress</h4>
        {latestProgress ? (
          <div>
            <img
              src={latestProgress.fileUrl}
              alt="Latest Gym Progress"
              className="img-fluid rounded shadow-sm"
              style={{ width: "100%", height: "auto" }}
            />
            <p className="text-muted">
              Uploaded on: {new Date(latestProgress.createdAt).toLocaleString()}
            </p>
            <p>{latestProgress.description}</p>

            {/* Like Button */}
            <button
              onClick={() => handleLike(latestProgress._id)}
              className="btn btn-primary"
            >
              👍 Like ({latestProgress.likes.length})
            </button>

            {/* Comments Section */}
            <div className="mt-3">
              <h5>💬 Comments</h5>
              {latestProgress.comments.map((comment, index) => (
                <div key={index} className="mb-2">
                  <p>{comment.text}</p>
                  <small className="text-muted">
                    Commented by: {comment.userId}
                  </small>
                </div>
              ))}

              {/* Add Comment Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const commentText = e.target.comment.value;
                  handleComment(latestProgress._id, commentText);
                  e.target.comment.value = ""; // Clear the input
                }}
              >
                <input
                  type="text"
                  name="comment"
                  placeholder="Add a comment..."
                  className="form-control mb-2"
                  required
                />
                <button type="submit" className="btn btn-secondary">
                  Add Comment
                </button>
              </form>
            </div>
          </div>
        ) : (
          <p>No uploaded progress yet.</p>
        )}
      </div>

      {/* Latest Workout Plan */}
      <div>
        <h4>📋 Latest Workout Plan</h4>
        {latestWorkout ? (
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">📅 {latestWorkout.title}</h5>
              <ul className="list-group">
                {latestWorkout.exercises.map((exercise) => (
                  <li
                    key={exercise._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>🏋️ {exercise.name}</span>
                    <span>
                      {exercise.sets} sets x {exercise.reps} reps
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p>No workouts added yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
