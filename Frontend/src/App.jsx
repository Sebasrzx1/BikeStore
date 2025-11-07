import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./components/Homepage";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

// Componente auxiliar para manejar la lógica del Navbar
function AppContent({ setIsRegistering }) {
  const location = useLocation();

  // Oculta el Navbar si estás en /login o /register
  const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />} {/* Solo se muestra si NO está en login/register */}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/login"
          element={<LoginForm setIsRegistering={setIsRegistering} />}
        />
        <Route
          path="/register"
          element={<RegisterForm setIsRegistering={setIsRegistering} />}
        />
      </Routes>
    </>
  );
}

export default function App() {
  const [isRegistering, setIsRegistering] = useState(false);



  return (
    <Router>
      <AppContent isRegistering={isRegistering} setIsRegistering={setIsRegistering} />
    </Router>
  );
}