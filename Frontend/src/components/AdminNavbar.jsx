// src/admin/AdminNavbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <section className="panel-botones">
      <button onClick={() => navigate("/admin/gestion-productos")}>
        🛒 Gestión de Productos
      </button>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </section>
  );
};

export default AdminNavbar;
