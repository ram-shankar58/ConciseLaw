import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './CaseDetails.css';

const CaseDetails = () => {
  const location = useLocation();
  const caseDetails = location.state?.caseDetails || [];

  const [selectedCase, setSelectedCase] = useState(null);

  // Handle card click to show the modal
  const handleCardClick = (caseDetail) => {
    setSelectedCase(caseDetail);
  };

  // Close the modal
  const closeModal = () => {
    setSelectedCase(null);
  };

  if (!Array.isArray(caseDetails) || caseDetails.length === 0) {
    return <p className="error-message">No case details available. Please try again.</p>;
  }

  return (
    <div className="case-details-container">
      <u><h2 className='middleyougo'>Similar Cases</h2></u>
      {caseDetails.map((caseDetail, index) => (
        <div
          key={index}
          className="case-card"
          onClick={() => handleCardClick(caseDetail)}
        >
          <h3>Case Name: {caseDetail.casename}</h3>
        </div>
      ))}

      {selectedCase && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="modal-close" onClick={closeModal}>&times;</span>
            <h2>{selectedCase.casename}</h2>
            <p><strong>Summary:</strong> {selectedCase.summary}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseDetails;