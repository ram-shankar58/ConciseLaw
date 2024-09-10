// src/App.js
import { Route, Routes } from "react-router-dom";
import Currencies from "./pages/Currencies.jsx";
import Explore from "./pages/Explore.jsx"; // Import Explore page
import CaseDetails from "./pages/CaseDetails.jsx"; // Import the CaseDetails page
import Contact from "./pages/Contact.jsx"; // Import Contact page
import Nav from "./components/Nav.jsx";
import Homepage from "./components/Home.jsx";
import "./style.css";

export default function App() {
  return (
    <div className="App">
      <Nav />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/currencies" element={<Currencies />} />
        <Route path="/case-details" element={<CaseDetails />} /> {/* Route for CaseDetails */}
        <Route path="/explore" element={<Explore />} /> {/* Route for Explore */}
        <Route path="/contact" element={<Contact />} /> {/* Route for Contact */}
      </Routes>
    </div>
  );
}
