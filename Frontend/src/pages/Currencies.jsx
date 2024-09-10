// src/pages/Currencies.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Currencies.css';

const Currencies = () => {
  const navigate = useNavigate();

  const handleGenerateResponse = () => {
    // Navigate to the CaseDetails page
    navigate('/case-details');
  };

  return (
    <div className="container">
      <label>Case Type:</label>
      <input
        type="text"
        placeholder="e.g., Contract Dispute"
      />
      <label>Specific Tags:</label>
      <input
        type="text"
        placeholder="e.g., Breach of Contract"
      />
      <div className="date-range">
        <div>
          <label>Start Date:</label>
          <input
            type="date"
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="date"
          />
        </div>
      </div>
      <label>Jurisdiction:</label>
      <input
        type="text"
        placeholder="e.g., California"
      />
      <div className="button-container">
        <button onClick={handleGenerateResponse}>
          Generate Response
        </button>
      </div>
    </div>
  );
};

export default Currencies;
