import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Auth.css'; // Import the CSS file for styling

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/register', {
        username,
        password,
      });
      setMessage(response.data.message);
      // Optionally redirect or handle further actions
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-heading">Create an Account</h2>
      <form onSubmit={handleRegister} className="auth-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="auth-button">Register</button>
      </form>
      {message && <p className="auth-message">{message}</p>}
      <p className="auth-footer">
        Already have an account? <Link to="/login" className="auth-link">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
