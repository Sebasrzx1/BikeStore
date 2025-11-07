import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Homepage.css";

const Homepage = () => {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/productos");
        setProductos(res.data);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };
    fetchProductos();
  }, []);

  return (
    <div className="productos-page">
      <section className="hero">
        <h1>Encuentra la bicicleta de tus sueños</h1>
        <p>Bicicletas de alta calidad para todo tipo de terreno y estilo</p>
        <button className="btn-hero" onClick={() => navigate("/login")}>
          Iniciar sesión
        </button>
      </section>

      <section className="productos-lista">
        <h2>Productos Populares</h2>
        <div className="productos-grid">
          {productos.length > 0 ? (
            productos.map((p) => (
              <div key={p.id_producto} className="card">
                <div className="card-img">
                  <img
                    src={`http://localhost:3000/${p.imagen}`}
                    alt={p.nombre_producto}
                  />
                </div>
                <div className="card-body">
                  <h4 className="marca">{p.marca}</h4>
                  <h3 className="nombre">{p.nombre_producto}</h3>
                  <p className="precio">
                    ${p.precio_unitario.toLocaleString("es-CO")}
                  </p>
                  <p className="stock">
                    {p.entradas - p.salidas} en stock
                  </p>
                  <button className="btn-add">Añadir al carrito</button>
                </div>
              </div>
            ))
          ) : (
            <p>Cargando productos...</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Homepage;
