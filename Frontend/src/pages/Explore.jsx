import React, { useState } from 'react';
import './Explore.css'; // Ensure this CSS file exists

const caseData = [
  {
    id: 1,
    title: 'Civil Cases',
    details: (
      <>
        <p>Civil cases involve conflicts between people or institutions such as businesses.</p>
        <p><strong>- Property Disputes: </strong>Cases related to land ownership, property division, or tenancy issues.</p>
        <p><strong>- Contract Disputes: </strong>Breach of contract cases between parties.</p>
        <p><strong>- Family Law Cases: </strong>Includes divorce, child custody, adoption, alimony, and inheritance disputes.</p>
        <p><strong>- Consumer Protection: </strong>Cases involving disputes between consumers and businesses for defective products or services.</p>
      </>
    ),
    image: 'https://bizimages.withfloats.com/actual/65f5df7be12940c9f42a9085.jpg'
  },
  {
    id: 2,
    title: 'Criminal Cases',
    details: (
      <>
        <p>Criminal cases involve enforcing public codes of behavior as embodied in the laws.</p>
        <p><strong>- Murder (IPC Section 302): </strong>Criminal offenses involving the unlawful killing of a person.</p>
        <p><strong>- Theft (IPC Sections 378-382): </strong>Cases involving theft, burglary, or robbery.</p>
        <p><strong>- Fraud and Cheating (IPC Sections 415-420): </strong>Cases involving deception or fraudulent activities.</p>
        <p><strong>- Cybercrime: </strong>Offenses involving the use of technology or the internet, such as hacking or online fraud.</p>
        <p><strong>- Domestic Violence (Domestic Violence Act, 2005): </strong>Crimes involving abuse within family or household relationships.</p>
      </>
    ),
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmwC8j6E8JGMETNGqp89YkRYPLuyWBWAhsag&s'
  },
  {
    id: 3,
    title: 'Constitutional Law Cases',
    details: (
      <>
        <p>Cases involving a substantial question of law as to the interpretation of the constitution.</p>
        <p><strong>- Fundamental Rights Violations: </strong>Cases involving the breach of fundamental rights under the Constitution.</p>
        <p><strong>- Judicial Review of Laws: </strong>Cases challenging the validity of laws under the Constitution.</p>
        <p><strong>- Public Interest Litigation (PIL): </strong>Cases brought by individuals or organizations in the interest of the public.</p>
      </>
    ),
    image: 'https://www.lawnn.com/wp-content/uploads/2017/06/constitutional-laws-of-indis-cases-judgements.jpg'
  },
  {
    id: 4,
    title: 'Commercial Cases',
    details: (
      <>
        <p>Commercial or business cases involve one or more business entities as parties.</p>
        <p><strong>- Corporate Disputes: </strong>Issues involving corporate governance, shareholder disputes, or mergers.</p>
        <p><strong>- Intellectual Property Cases: </strong>Cases involving trademarks, copyrights, patents, and trade secrets.</p>
        <p><strong>- Banking And Finance: </strong>Disputes involving financial institutions, loans, and securities.</p>
      </>
    ),
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBCIW5fiYBqjrLxdxbooIUtzVIWG4WgKkjew&s'
  },
  {
    id: 5,
    title: 'Labour Cases',
    details: (
      <>
        <p>Labour law addresses the legal rights of working people and their organizations.</p>
        <p><strong>- Unfair Dismissal: </strong>Disputes involving wrongful termination of employees.</p>
        <p><strong>- Wage Disputes: </strong>Cases related to non-payment or underpayment of wages.</p>
        <p><strong>- Industrial Disputes: </strong>Conflicts between employers and workers, often involving strikes or lockouts.</p>
      </>
    ),
    image: 'https://www.insaaf.co.in/media/43/1669364679.png'
  },
  {
    id: 6,
    title: 'Environmental Law Cases',
    details: (
      <>
        <p>A legal framework to safeguard and maintain the environment.</p>
        <p><strong>- Pollution Control: </strong>Cases involving air, water, or soil pollution.</p>
        <p><strong>- Wildlife Protection: </strong>Cases involving poaching, deforestation, or harm to wildlife.</p>
      </>
    ),
    image: 'https://www.maansarovarlawcentre.com/img/blog/mlc-blog-1.jpg'
  },
  {
    id: 7,
    title: 'Taxation Cases',
    details: (
      <>
        <p>Cases involving taxes imposed on citizens and corporate entities.</p>
        <p><strong>- Income Tax Disputes: </strong>Disputes involving the assessment, deduction, or recovery of income taxes.</p>
        <p><strong>- GST and Indirect Tax Cases: </strong>Cases related to Goods and Services Tax (GST) and other indirect taxes like excise duties or customs duties.</p>
        <p><strong>- Environmental Impact Assessment (EIA): </strong>Disputes regarding the environmental impact of industrial projects.</p>
      </>
    ),
    image: 'https://media.licdn.com/dms/image/C4D12AQHTgi1u8djfDA/article-cover_image-shrink_720_1280/0/1601717064450?e=2147483647&v=beta&t=U6Yae7S1aQ17zYyV3TyTKs7MA7Gw_VMl0t3GeSuIibc'
  },
  {
    id: 8,
    title: 'Human Rights Cases',
    details: (
      <>
        <p>Cases that protect the basic rights and freedoms to which all humans are entitled.</p>
        <p><strong>- Human Trafficking: </strong>Cases involving trafficking of persons for labor or sexual exploitation.</p>
        <p><strong>- Custodial Death: </strong>Deaths in police or judicial custody leading to investigations or legal actions.</p>
        <p><strong>- Child Rights: </strong>Cases involving the protection of children from abuse, exploitation, or neglect.</p>
      </>
    ),
    image: 'https://blog.ipleaders.in/wp-content/uploads/2021/07/Human-rights.jpg'
  },
  {
    id: 9,
    title: 'Election Law Cases',
    details: (
      <>
        <p>Election law deals with the legal aspects of elections and political activities.</p>
        <p><strong>- Election Petitions: </strong>Disputes regarding the conduct of elections and the validity of election results.</p>
        <p><strong>- Disqualification of Candidates: </strong>Cases involving disqualification of candidates under various laws.</p>
      </>
    ),
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTa-j3y38JQ7_MKr9Yrrbzcdc1baK5MT5vA7A&s'
  }
];

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleTileClick = (caseItem) => {
    setSelectedCase(caseItem);
  };

  const handleCloseModal = () => {
    setSelectedCase(null);
  };

  const filteredCases = caseData.filter((caseItem) =>
    caseItem.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="explore-container">
      <input
        type="text"
        placeholder="Search cases..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-bar"
      />
      <div className="case-grid">
        {filteredCases.map((caseItem) => (
          <div
            key={caseItem.id}
            className="case-tile"
            onClick={() => handleTileClick(caseItem)}
          >
            <img src={caseItem.image} alt={caseItem.title} className="case-image" />
            <div className="case-title"><strong>{caseItem.title}</strong></div>
          </div>
        ))}
      </div>

      {selectedCase && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedCase.title}</h2>
            {selectedCase.details}
            <button className="modal-close" onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;
