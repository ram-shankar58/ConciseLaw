import React from 'react';
import { useLocation } from 'react-router-dom';
import './CaseDetails.css';

const CaseDetails = () => {
  const location = useLocation();
  const caseIds = location.state?.caseIds || [];

  if (!Array.isArray(caseIds)) {
    return <p>Error: Case IDs are not available.</p>;
  }

  return (
    <div className="case-details-container">
      {caseIds.map((caseId, index) => (
        <div key={index} className="case-card">
          <h3>Case ID: {caseId}</h3>
        </div>
      ))}
    </div>
  );
};

export default CaseDetails;
