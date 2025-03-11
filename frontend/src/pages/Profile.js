import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setPreview(res.data.profilePicture);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update user details (username, email, workout goals)
      await axios.put('http://localhost:5000/api/profile', user, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Upload profile picture if selected
      if (profilePicture) {
        const formData = new FormData();
        formData.append('profilePicture', profilePicture);
        await axios.post('http://localhost:5000/api/profile/upload-picture', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      alert('Profile updated successfully');
      fetchProfile(); // Refresh data after update
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Profile</h2>
      <div className="card p-4 shadow">
        {/* Profile Picture */}
        <div className="text-center">
          {preview ? (
            <img src={preview} alt="Profile" className="rounded-circle mb-3" style={{ width: '120px', height: '120px' }} />
          ) : (
            <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '120px', height: '120px' }}>
              No Image
            </div>
          )}
          <input type="file" className="form-control mt-2" onChange={handleFileChange} />
        </div>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input type="text" className="form-control" name="username" value={user.username || ''} onChange={handleChange} required />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" name="email" value={user.email || ''} onChange={handleChange} required />
          </div>

          {/* Workout Goals */}
          <div className="mb-3">
            <label className="form-label">Workout Goals</label>
            <textarea className="form-control" name="workoutGoals" value={user.workoutGoals || ''} onChange={handleChange} rows="3"></textarea>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
