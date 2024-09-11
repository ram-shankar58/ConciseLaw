import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css'; // Import the CSS file for styling

const Login = () => {
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/login', {
        username,
        password,
      });
      // After successful login
        sessionStorage.setItem('loggedIn', true); // Mark as logged in
        const timeoutTime = new Date().getTime() + 10 * 60 * 1000;  // 10 minutes timeout
        sessionStorage.setItem("timeout", timeoutTime);
 // Mark as logged in
      navigate('/'); // Redirect to the homepage
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="auth-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="auth-button">Login</button>
      </form>
      {message && <p className="auth-message">{message}</p>}
      <p>
        Don't have an account? <Link to="/register" className="auth-link">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
