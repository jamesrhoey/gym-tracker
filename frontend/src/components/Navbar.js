import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-primary">
      <div className="container">
        <Link className="navbar-brand text-white" to="/dashboard">
          Gym Tracker
        </Link>
        <div className="d-flex">
          <Link className="btn btn-warning me-2" to="/upload">📤 Upload Progress</Link>
          <Link className="btn btn-success me-2" to="/add-workout">🏋️ Add Workout</Link>
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
