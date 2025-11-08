import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";
import logo from "/Logo.png";

const Navbar = () => {
  const [cantidadCarrito, setCantidadCarrito] = useState(0);

  // Leer carrito desde localStorage al cargar la página
  useEffect(() => {
    const actualizarCarrito = () => {
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
      setCantidadCarrito(total);
    };

    actualizarCarrito();

    // Escucha cambios en localStorage desde otras partes del app
    window.addEventListener("storage", actualizarCarrito);
    return () => window.removeEventListener("storage", actualizarCarrito);
  }, []);

  // Cada vez que se agregue algo al carrito (por ejemplo, desde DetalleProducto),
  // actualiza el número inmediatamente.
  useEffect(() => {
    const observer = setInterval(() => {
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
      setCantidadCarrito(total);
    }, 500); // revisa cada medio segundo (suave y efectivo)
    return () => clearInterval(observer);
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="BikeStore" />
      </div>

      <ul className="nav-links">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/catalogo" className="hover:text-blue-400">Productos</Link></li>
        <li><Link to="/">Sobre Nosotros</Link></li>
      </ul>

      <div className="contcarrito">
        <div className="desingloginregister">
          <p><Link to="/login">Registro/Acceso</Link></p>
        </div>
        <div className="carrito-icono">
          <Link to="/carrito">
            <img src="/Vector.svg" alt="Carrito" className="icono-carrito" />
            {cantidadCarrito > 0 && (
              <span className="carrito-badge">{cantidadCarrito}</span>
            )}
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
