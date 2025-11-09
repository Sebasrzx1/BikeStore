import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/CuentaCliente.css"

const CuentaCliente = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="cuenta-cliente">
      <h2>Mi Cuenta</h2>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
};

export default CuentaCliente;
