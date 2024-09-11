import { Link } from "react-router-dom";
import React from 'react';
import './Nav.css'; // Make sure this path is correct based on your folder structure

export default function Nav() {

  // Logout function to handle logging out
  const handleLogout = () => {
    sessionStorage.removeItem("loggedIn");
    sessionStorage.removeItem("timeout");
    alert("You have been logged out.");
    window.location.href = "/login"; // Redirect to the login page
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo-link">
        <div className="logo">ConciseLaw</div>
      </Link>
      
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/explore">Explore</Link>
        </li>
        <li>
          <Link to="/currencies">Search Engine</Link>
        </li>
        <li>
          <Link to="/chatbot">Chatbot</Link>
        </li>
        <li>
          <Link to="/contact">Contact Us</Link>
        </li>
      </ul>

      <div className="profile-section">
        <div className="logout-container">
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        
        <select className="language-select">
          <option value="en">EN</option>
          <option value="hi">HI</option>
          <option value="bn">BN</option>
        </select>
      </div>
    </nav>
  );
}