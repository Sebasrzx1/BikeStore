import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/CuentaCliente.css";

const CuentaCliente = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="cuenta-cliente">
      <h2>Mi Cuenta</h2>

      {user ? (
        <>
          <p>
            <strong>Nombre:</strong> {user.nombre}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </>
      ) : (
        <p>No hay información del usuario</p>
      )}

      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
};

export default CuentaCliente;
