import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/Navbar.css";
import { useNavigate } from "react-router-dom";

const Navbar = ({ cantidadCarrito }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const toggleMenu = () => setMenuAbierto(!menuAbierto);
  const navigate = useNavigate();
  
  return (
    <div className="Contenedor-navPrincipal">
      <nav className="navbar">
        <div className="nav-logo">
          <Link to="/">
            <img src="/Logo.png" alt="BikeStore Logo" />
          </Link>
        </div>

        <ul className={`nav-links ${menuAbierto ? "active" : ""}`}>
          <li key="inicio">
            <Link to="/">Inicio</Link>
          </li>
          <li key="catalogo">
            <Link to="/catalogo">Catálogo</Link>
          </li>
          <li key="sobre-nosotros">
            <Link to="/SobreNosotros">Sobre nosotros</Link>
          </li>
        </ul>

        <div className="Contcarrito-accesoregistro">
          {isAuthenticated ? (
            isAdmin ? (
              <Link to="/admin" key="admin">
                <div className="desingloginregisteradmin">
                  <img src="/IconAdmin.svg" alt="Admin" />
                </div>
              </Link>
            ) : (
              <Link to="/cuenta" className="desingloginregister" key="perfil">
                <img src="/IconPerfil.svg" alt="Perfil" />
              </Link>
            )
          ) : (
            <button onClick={() => navigate("/login")} className="desingloginregisterdesc" key="login">
              Acceso / Registro
            </button>
          )}

          {/* Condición corregida: Mostrar carrito si NO es admin (invitado o cliente) */}
          {!isAdmin && (
            <div className="contcarrito">
              <div className="carrito-icono">
                <Link to="/carrito">
                  <img src="/Vector.svg" alt="Carrito" className="icono-carrito" />
                  {cantidadCarrito > 0 && (
                    <span className="carrito-contador">{cantidadCarrito}</span>
                  )}
                </Link>
              </div>
            </div>
          )}
        </div>

        <div
          className={`hamburger ${menuAbierto ? "active" : ""}`}
          onClick={toggleMenu}
        ></div>
      </nav>
    </div>
  );
};

export default Navbar;
