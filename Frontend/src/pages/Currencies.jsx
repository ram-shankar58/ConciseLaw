import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Currencies.css';

const Currencies = () => {
  const navigate = useNavigate();

  const [caseType, setCaseType] = useState('');
  const [description, setDescription] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [error, setError] = useState(null);

  const handleGenerateResponse = async () => {
    const formData = {
      "text": description,
    };

    try {
      const response = await axios.post('http://localhost:8000/predict', formData);
      console.log('Response from backend:', response.data);

      const similarCases = response.data.similar_cases;
      if (Array.isArray(similarCases)) {
        navigate('/case-details', { state: { caseDetails: similarCases } });
      } else {
        console.error('Expected an array for similar_cases but got:', similarCases);
        setError('Unexpected data format received.');
      }
    } catch (error) {
      console.error('Error generating response:', error);
      setError('Failed to generate response. Please try again.');
    }
  };

  return (
    <div className="container">
      {error && <p className="error-message">{error}</p>}

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
        rows="6"
      />

      <label>Jurisdiction:</label>
      <input
        type="text"
        value={jurisdiction}
        onChange={(e) => setJurisdiction(e.target.value)}
        placeholder="e.g., Tamil Nadu"
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