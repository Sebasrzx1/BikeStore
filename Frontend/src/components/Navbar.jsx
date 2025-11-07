import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";
import logo from '/Logo.png'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="BikeStore" />
      </div>

      <ul className="nav-links">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/catalogo" className="hover:text-blue-400">Productos</Link></li>
        <li><Link to="/">Sobre Nostros</Link></li>
      </ul>
        <div className="contcarrito">
          <div className="desingloginregister">
          <p><Link to="/login">Registro/Acceso</Link></p>
          </div>
          <img src="./public/Vector.svg" alt="" />
        </div>
    </nav>
  );
};
export default Navbar;
