import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setSuccess('Login successful! Redirecting to Dashboard...');
        
        setTimeout(() => {
          window.location.href = '/dashboard'; // Forces a hard refresh
        }, 1000);
      } else {
        setError('Invalid login response');
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="container mt-5">
      <div className="col-md-6 offset-md-3">
        <h2 className="text-center">Login</h2>
        {error && <p className="alert alert-danger">{error}</p>}
        {success && <p className="alert alert-success">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password:</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
