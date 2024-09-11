import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Currencies from "./pages/Currencies.jsx";
import Explore from "./pages/Explore.jsx";
import CaseDetails from "./pages/CaseDetails.jsx";
import Contact from "./pages/Contact.jsx";
import Nav from "./components/Nav.jsx";
import Homepage from "./components/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Chatbot from "./pages/Chatbot.jsx";
import Footer from "./components/Footer.jsx";
import "./style.css";

// PrivateRoute component to protect routes
function PrivateRoute({ children }) {
  const isAuthenticated = sessionStorage.getItem("loggedIn"); // Check if the user is logged in
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check for session timeout
    const timeout = sessionStorage.getItem("timeout");

    if (timeout) {
      const now = new Date().getTime();
      if (now > timeout) {
        sessionStorage.removeItem("loggedIn");
        sessionStorage.removeItem("timeout");
        alert("Session expired. You have been logged out.");
        navigate("/login");  // Redirect to the login page
      }
    }

    // Set up session expiration after 10 minutes of inactivity
    const setSessionTimeout = () => {
      const timeoutTime = new Date().getTime() + 10 * 60 * 1000;  // 10 minutes
      sessionStorage.setItem("timeout", timeoutTime);
    };

    setSessionTimeout();  // Set initial timeout

    // Add event listeners to reset the session timeout on user activity
    window.addEventListener("mousemove", setSessionTimeout);
    window.addEventListener("keypress", setSessionTimeout);

    return () => {
      window.removeEventListener("mousemove", setSessionTimeout);
      window.removeEventListener("keypress", setSessionTimeout);
    };
  }, [navigate]);

  return (
    <div className="App">
      <Nav />
      <Routes>
        {/* Only allow login and register pages without authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Wrap all other routes inside PrivateRoute */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Homepage />
            </PrivateRoute>
          }
        />
        <Route
          path="/currencies"
          element={
            <PrivateRoute>
              <Currencies />
            </PrivateRoute>
          }
        />
        <Route
          path="/case-details"
          element={
            <PrivateRoute>
              <CaseDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <PrivateRoute>
              <Explore />
            </PrivateRoute>
          }
        />
        <Route
          path="/chatbot"
          element={
            <PrivateRoute>
              <Chatbot />
            </PrivateRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <PrivateRoute>
              <Contact />
            </PrivateRoute>
          }
        />
        {/* Redirect any unknown path to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <Footer />
    </div>
  );
}
