// src/pages/CaseDetails.jsx
import React, { useState } from 'react';
import './CaseDetails.css'; // Ensure this CSS file exists

// Updated case data with real case details
const caseData = [
  {
    id: 1,
    title: 'CBSE vs. Educomp Solutions (2016)',
    details: `**Issue:** The Central Board of Secondary Education (CBSE) had contracted Educomp Solutions to provide digital education content for schools. Educomp alleged breach of contract when CBSE failed to fulfill certain terms.\n\n**Outcome:** The court ruled in favor of Educomp, stating that CBSE had prematurely terminated the contract without proper cause. Educomp was awarded compensation for losses incurred due to the termination.`,
  },
  {
    id: 2,
    title: 'Pearson India vs. Laxmi Publications (2017)',
    details: `**Issue:** Pearson India, a global educational publisher, filed a copyright infringement case against Laxmi Publications for unauthorized reproduction of its educational content in textbooks.\n\n**Outcome:** The court granted an injunction against Laxmi Publications, prohibiting them from publishing the infringing content. Pearson was also awarded damages for the loss of market share caused by the infringement.`,
  },
  {
    id: 3,
    title: 'S. Chand & Co. vs. Oxford University Press (2018)',
    details: `**Issue:** S. Chand & Co. filed a case against Oxford University Press over the use of similar book titles in the competitive educational publishing sector, alleging trademark infringement.\n\n**Outcome:** The dispute was resolved through a mutual settlement, where both parties agreed to share certain rights over the disputed book titles and modify their branding strategies to avoid further conflicts.`,
  },
  {
    id: 4,
    title: 'FIITJEE vs. Aakash Educational Services (2020)',
    details: `**Issue:** FIITJEE, a well-known coaching institute for IIT-JEE preparation, accused Aakash Educational Services of making misleading claims in their advertisements that falsely promised higher success rates than FIITJEE.\n\n**Outcome:** The commercial court found Aakash guilty of misrepresentation in its marketing. A fine was imposed on Aakash, and the institute was required to alter its advertising to remove the misleading claims.`,
  },
  {
    id: 5,
    title: 'NIIT Technologies vs. IIPM (2014)',
    details: `**Issue:** NIIT Technologies provided IT solutions to IIPM for their educational services. However, IIPM allegedly failed to pay for the services rendered. NIIT took the matter to court over the unpaid dues.\n\n**Outcome:** The court ruled in favor of NIIT Technologies, ordering IIPM to clear the outstanding payments with interest. The case highlighted issues related to financial transparency in private educational institutions.`,
  },
  {
    id: 6,
    title: 'Vidyamandir Classes vs. Allen Career Institute (2019)',
    details: `**Issue:** Vidyamandir Classes, a popular coaching center for competitive exams, accused Allen Career Institute of using their proprietary test materials and study resources without authorization.\n\n**Outcome:** The court sided with Vidyamandir, issuing an injunction against Allen, preventing them from further use of the materials. Vidyamandir was also awarded compensation for the unauthorized use of their intellectual property.`,
  },
];

const CaseDetails = () => {
  const [selectedCase, setSelectedCase] = useState(null);

  const handleTileClick = (caseItem) => {
    setSelectedCase(caseItem);
  };

  const handleCloseModal = () => {
    setSelectedCase(null);
  };

  return (
    <div className="case-details-container">
      {caseData.map((caseItem) => (
        <div
          key={caseItem.id}
          className="case-tile"
          onClick={() => handleTileClick(caseItem)}
        >
          <strong>{caseItem.title}</strong>
        </div>
      ))}

      {selectedCase && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedCase.title}</h2>
            <div className="case-details">
              <p><strong>Issue:</strong> {selectedCase.details.split('\n\n')[0].replace('**Issue:** ', '')}</p>
              <p><strong>Outcome:</strong> {selectedCase.details.split('\n\n')[1].replace('**Outcome:** ', '')}</p>
            </div>
            <button className="modal-close" onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseDetails;
