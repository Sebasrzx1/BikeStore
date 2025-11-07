import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Tienda.css"; // 👈 Nueva hoja de estilos

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProd, resCat] = await Promise.all([
          axios.get("http://localhost:3000/api/productos"),
          axios.get("http://localhost:3000/api/categorias"),
        ]);
        setProductos(resProd.data);
        setCategorias(resCat.data);
      } catch (error) {
        console.error("Error al cargar productos o categorías:", error);
      }
    };
    fetchData();
  }, []);

  const toggleCategoria = (idCategoria) => {
    setCategoriasSeleccionadas((prev) =>
      prev.includes(idCategoria)
        ? prev.filter((id) => id !== idCategoria)
        : [...prev, idCategoria]
    );
  };

  const productosFiltrados = productos.filter((prod) => {
    const coincideBusqueda = prod.nombre_producto
      ?.toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideCategoria =
      categoriasSeleccionadas.length === 0 ||
      categoriasSeleccionadas.includes(prod.id_categoria);
    return coincideBusqueda && coincideCategoria;
  });

  return (
    <div className="tienda-page">
      {/* Sidebar de filtros */}
      <aside className="tienda-filtros">
        <h2 className="tienda-filtros-titulo">Filtros</h2>

        <div className="tienda-busqueda">
          <label>Buscar producto:</label>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Ej. Bicicleta, casco..."
          />
        </div>

        <div className="tienda-categorias">
          <h3>Categorías</h3>
          <ul>
            {categorias.map((cat) => (
              <li key={cat.id_categoria}>
                <input
                  type="checkbox"
                  id={`cat-${cat.id_categoria}`}
                  checked={categoriasSeleccionadas.includes(cat.id_categoria)}
                  onChange={() => toggleCategoria(cat.id_categoria)}
                />
                <label htmlFor={`cat-${cat.id_categoria}`}>
                  {cat.nombre_categoria}
                </label>
              </li>
            ))}
          </ul>
        </div>

        {(categoriasSeleccionadas.length > 0 || busqueda) && (
          <button
            onClick={() => {
              setCategoriasSeleccionadas([]);
              setBusqueda("");
            }}
            className="tienda-btn-limpiar"
          >
            Limpiar filtros
          </button>
        )}
      </aside>

      {/* Productos */}
      <section className="tienda-productos">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((p) => (
            <div key={p.id_producto} className="tienda-card">
              <div className="tienda-card-img">
                <img
                  src={`http://localhost:3000/${p.imagen}`}
                  alt={p.nombre_producto}
                />
              </div>
              <div className="tienda-card-body">
                <h4 className="tienda-marca">{p.marca}</h4>
                <h3 className="tienda-nombre">{p.nombre_producto}</h3>
                <p className="tienda-precio">
                  ${p.precio_unitario.toLocaleString("es-CO")}
                </p>
                <p className="tienda-stock">
                  {p.entradas - p.salidas} en stock
                </p>
                <button className="tienda-btn-add">Añadir al carrito</button>
              </div>
            </div>
          ))
        ) : (
          <p className="tienda-vacio">No se encontraron productos.</p>
        )}
      </section>
    </div>
  );
}
