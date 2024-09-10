import React, { useState, useEffect } from 'react';
import './Contact.css';

const testimonialsData = [
  {
    name: "Noel Joseph Varghese",
    text: "This platform has transformed the way we handle legal research. It's fast, intuitive, and incredibly useful.",
  },
  {
    name: "Priya Mohan",
    text: "I can't believe how much time I've saved using this tool. Highly recommended for anyone in the legal field!",
  },
  {
    name: "Suresh Gopi",
    text: "The best legal research assistant I've ever used. It helps me streamline all my tasks in no time.",
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) => (prevIndex + 1) % testimonialsData.length);
    }, 4000); // Change slide every 4 seconds
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="contact-page">
      <div className="contact-details">
        <div className="contact-info">
          <h1>Contact Us</h1>
          <div className="contact-item">
            <i className="fas fa-map-marker-alt"></i>
            <p>Kelambakkam - Vandalur Rd, Rajan Nagar, Chennai, Tamil Nadu 600127</p>
          </div>
          <div className="contact-item">
            <i className="fas fa-envelope"></i>
            <p>support@legalhub.com</p>
          </div>
          <div className="contact-item">
            <i className="fas fa-phone"></i>
            <p>+91-9060015383</p>
          </div>
        </div>

        <div className="testimonials-section">
          <h2>What Our Clients Say</h2>
          <div className="testimonial-slide">
            <p>"{testimonialsData[currentTestimonialIndex].text}"</p>
            <h4>- {testimonialsData[currentTestimonialIndex].name}</h4>
          </div>
        </div>
      </div>

      <div className="contact-form">
        <div className="form-container">
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Message:</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
