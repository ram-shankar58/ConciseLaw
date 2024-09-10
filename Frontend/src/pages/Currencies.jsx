import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Import axios for making API requests
import './Currencies.css';

const Currencies = () => {
  const navigate = useNavigate();

  // Set up state for each form field
  const [caseType, setCaseType] = useState('');
  const [description, setDescription] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');

  // Handle form submission
  const handleGenerateResponse = async () => {
    const formData = {
      caseType,
      description,
      jurisdiction,
    };

    try {
      // Send a POST request to your backend API
      const response = await axios.post('http://localhost:5000/api/cases', formData);
      console.log('Response from backend:', response.data);
      
      // Navigate to the CaseDetails page (adjust the path as needed)
      navigate('/case-details');
    } catch (error) {
      console.error('Error generating response:', error);
    }
  };

  return (
    <div className="container">
      <label>Case Type:</label>
      <input
        type="text"
        value={caseType}
        onChange={(e) => setCaseType(e.target.value)}
        placeholder="e.g., Contract Dispute"
      />

      <label>Description:</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Provide a detailed description of the case"
        rows="6"  // Makes the text box larger
      />

      <label>Jurisdiction:</label>
      <input
        type="text"
        value={jurisdiction}
        onChange={(e) => setJurisdiction(e.target.value)}
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
