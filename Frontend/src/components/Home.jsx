import React from 'react';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <section className="hero-banner">
        <div className="hero-content">
          <h1>Welcome to ConciseLaw</h1>
          <p>AI-Driven Legal Research Engine for streamlined, intelligent legal case research.</p>
          <a href="#what-we-offer" className="hero-button">Explore Features</a>
        </div>
      </section>

      <section id="what-we-offer" className="about">
        <h2>What We Offer</h2>
        <p>ConciseLaw provides judges, lawyers, and researchers with an AI-powered platform to quickly locate relevant laws, past rulings, and case summaries. Our intuitive interface and powerful algorithms ensure timely legal insights.</p>
      </section>

      <section className="process">
        <h2>Our Process</h2>
        <div className="steps-container">
          <div className="step">
            <img src="https://cdn-icons-png.flaticon.com/512/2912/2912872.png" alt="Step 1" />
            <h3>Input Information</h3>
            <p>Fill out the case details and tags for more accurate results.</p>
          </div>
          <div className="step">
            <img src="https://i0.wp.com/bdtechtalks.com/wp-content/uploads/2019/11/human-brain-gears.jpg?fit=4300%2C2580&ssl=1" alt="Step 2" />
            <h3>AI Analysis</h3>
            <p>Our AI processes legal data and provides case summaries and relevant laws.</p>
          </div>
          <div className="step">
            <img src="https://banner2.cleanpng.com/20240114/xfz/transparent-icon-justice-balance-fairness-scales-symbolic-image-representing-justice-balance-1710923312054.webp" alt="Step 3" />
            <h3>Receive Results</h3>
            <p>View summarized legal information and download your reports.</p>
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <h2>Core Features</h2>
        <ul>
          <li>AI-powered legal data aggregation.</li>
          <li>Tailored case suggestions and legal precedents.</li>
          <li>Case predictions using historical data.</li>
          <li>Regional and multilingual support for Indian courts.</li>
        </ul>
      </section>
    </div>
  );
}
