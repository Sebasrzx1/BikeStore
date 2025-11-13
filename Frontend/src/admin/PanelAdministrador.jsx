import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PanelAdministrador = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="panel-admin">
      <header className="panel-header">
        <h1>⚙️ Panel de Administración</h1>
        <div className="panel-user">
          <span>
            Bienvenido, <strong>{user?.nombre || "Administrador"}</strong>
          </span>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </header>

      <main className="panel-main">
        <section>
          <h2>👋 Bienvenido al panel</h2>
          <p>
            Desde aquí podrás gestionar la tienda: productos, usuarios y
            pedidos.
          </p>

          <div className="panel-buttons">
            <button onClick={() => navigate("/admin/gestion-productos")}>
              🛒 Gestión de Productos
            </button>

            <button onClick={() => alert("Próximamente...")}>
              👥 Gestión de Usuarios
            </button>

            <button onClick={() => alert("Próximamente...")}>
              📦 Gestión de Pedidos
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PanelAdministrador;
