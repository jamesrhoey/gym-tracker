import React, { useState, useEffect } from "react";
import axios from "axios";

const WorkoutHistory = () => {
  const [workouts, setWorkouts] = useState([]);
  const [stats, setStats] = useState({ totalSets: 0, totalReps: 0 });
  const [weeklyReport, setWeeklyReport] = useState(null);
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("Authentication token missing. Please log in.");
      setLoading(false);
      return;
    }

    fetchWorkouts();
    fetchTodayStats();
    fetchReports();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/workouts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkouts(res.data);
    } catch (error) {
      setError("Error fetching workouts. Please try again.");
      console.error("Error fetching workouts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/workouts/stats/today", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching today's stats:", error);
    }
  };

  const fetchReports = async () => {
    try {
      const weeklyRes = await axios.get("http://localhost:5000/api/workouts/report?period=weekly", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWeeklyReport(weeklyRes.data);

      const monthlyRes = await axios.get("http://localhost:5000/api/workouts/report?period=monthly", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMonthlyReport(monthlyRes.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h4>🏋️ Workout History & Stats</h4>

      {loading ? (
        <p>Loading workout data...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <>
          {/* Daily Stats */}
          <h5>📅 Today's Summary</h5>
          <p>Total Sets: {stats.totalSets}</p>
          <p>Total Reps: {stats.totalReps}</p>

          {/* Workout History */}
          <h5>📜 Workout Log</h5>
          {workouts.length === 0 ? (
            <p>No workouts logged yet.</p>
          ) : (
            workouts.map((workout) => (
              <div key={workout._id} className="mb-3 p-3 border rounded">
                <h6>{workout.title}</h6>
                <ul>
                  {workout.exercises.map((exercise, index) => (
                    <li key={index}>
                      {exercise.name}: {exercise.sets} sets x {exercise.reps} reps
                    </li>
                  ))}
                </ul>
                <p className="text-muted">Logged on: {new Date(workout.createdAt).toLocaleString()}</p>
              </div>
            ))
          )}

          {/* Weekly & Monthly Reports */}
          <h5>📊 Workout Reports</h5>
          {weeklyReport && (
            <div className="mb-3 p-3 border rounded">
              <h6>📅 Weekly Report</h6>
              <p>Total Workouts: {weeklyReport.totalWorkouts}</p>
              <p>Total Sets: {weeklyReport.totalSets}</p>
              <p>Total Reps: {weeklyReport.totalReps}</p>
            </div>
          )}

          {monthlyReport && (
            <div className="mb-3 p-3 border rounded">
              <h6>📆 Monthly Report</h6>
              <p>Total Workouts: {monthlyReport.totalWorkouts}</p>
              <p>Total Sets: {monthlyReport.totalSets}</p>
              <p>Total Reps: {monthlyReport.totalReps}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WorkoutHistory;
