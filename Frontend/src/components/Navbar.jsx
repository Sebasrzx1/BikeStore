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
        <li><Link to="/tienda" className="hover:text-blue-400">Tienda</Link></li>
        <li><Link to="/">Sobre Nostros</Link></li>
        <li><Link to="/login">Registro/Acceso</Link></li>
      </ul>
    </nav>
  );
};
export default Navbar;
