import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Homepage.css";
import HeroSlider from "./Heroslider";

const Homepage = () => {
  const [productos, setProductos] = useState([]);

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

  const categoriasPermitidasIds = [1, 2, 3];

  // Filtrar y ordenar todos los productos válidos
  const productosFiltrados = productos
    .filter((p) => categoriasPermitidasIds.includes(Number(p.id_categoria)))
    .sort((a, b) => (b.salidas || 0) - (a.salidas || 0));

  // Agrupar y limitar a 4 productos por categoría
  const productosPorCategoria = {};
  categoriasPermitidasIds.forEach((id) => {
    productosPorCategoria[id] = productosFiltrados
      .filter((p) => Number(p.id_categoria) === id)
      .slice(0, 4);
  });



  return (
    <div className="productos-page">
      <HeroSlider />
      <section className="hero">
        <h1>COMPRA POR CATÁLOGO</h1>
        <p>Encuentra exactamente lo que necesitas para tu viaje en bicicleta</p>
      </section>

      <section className="productos-lista">
        <h2>Productos Populares</h2>

        {Object.entries(productosPorCategoria).map(([id, items]) => {
          let nombreCategoria = "";
          if (id === "1") nombreCategoria = "Bicicletas";
          if (id === "2") nombreCategoria = "Repuestos";
          if (id === "3") nombreCategoria = "Accesorios";

          return (
            <div key={id}>
              <h3 className="titulocategoria">{nombreCategoria}</h3>
              <div className="productos-grid">
                {items.map((p) => (
                  <div key={p.id_producto} className="cardProductos">
                    <div className="card-img">
                      <img
                        src={`http://localhost:3000/${p.imagen}`}
                        alt={p.nombre_producto}
                      />
                    </div>
                    <div className="card-body">
                      <h4 className="marca">{p.marca}</h4>
                      <h3 className="nombre">{p.nombre_producto}</h3>
                      <div className="contprecio">
                        <p className="precio">
                          ${p.precio_unitario.toLocaleString("es-CO")}
                        </p>
                        <p className="stock">{p.entradas - p.salidas} en stock</p>
                      </div>
                      <button className="btn-add">Añadir al carrito</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div >
  );
};

export default Homepage;
