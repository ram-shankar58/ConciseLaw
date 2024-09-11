// Footer.js
import React from 'react';
import './Footer.css'; // Import the CSS for styling

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h4>About LegalHub</h4>
          <p>LegalHub is your go-to platform for legal information and guidance on law violations and government rules. Our mission is to empower citizens with easy-to-understand legal insights.</p>
        </div>
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: support@conciselaw.com</p>
          <p>Phone: +91 8921882776</p>
        </div>
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ConciseLaw. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;