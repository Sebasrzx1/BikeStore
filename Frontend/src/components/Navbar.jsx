import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/Navbar.css";

const Navbar = ({ cantidadCarrito }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/">
          <img src="/Logo.png" alt="BikeStore Logo" />
        </Link>
      </div>

      <ul className={`nav-links ${menuAbierto ? "active" : ""}`}>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/catalogo">Catálogo</Link></li>
        <li><Link to="/">Sobre nosotros</Link></li>
      </ul>

      <div className="Contcarrito-accesoregistro">
        {isAuthenticated ? (
          isAdmin ? (
            <Link to="/admin" className="desingloginregister">
              <img src="/IconAdmin.svg" alt="Admin" />
            </Link>
          ) : (
            <Link to="/cuenta" className="desingloginregister">
              <img src="/IconPerfil.svg" alt="Perfil" />
            </Link>
          )
        ) : (
          <Link to="/login" className="desingloginregisterdesc">
            <p>Acceso / Registro</p>
          </Link>
        )}

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
      </div>

      <div
        className={`hamburger ${menuAbierto ? "active" : ""}`}
        onClick={toggleMenu}
      ></div>
    </nav>
  );
};

export default Navbar;
