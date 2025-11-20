import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { agregarUnidadAlCarrito } from "../utils/carrito";
import "../styles/Tienda.css";
import { useToast } from "../context/ToastContext";

export default function Catalogo({ setCantidadCarrito }) {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [precioMin, setPrecioMin] = useState(10000);
  const [precioMax, setPrecioMax] = useState(2000000);
  const { mostrarToast } = useToast();

  const [filtrosOpen, setFiltrosOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProd, resCat] = await Promise.all([
          axios.get("http://localhost:3000/api/productos"),
          axios.get("http://localhost:3000/api/categorias"),
        ]);

        const productosData = resProd.data;
        setProductos(productosData);
        setCategorias(resCat.data);

        const precios = productosData.map((p) => p.precio_unitario);
        setPrecioMin(Math.min(...precios));
        setPrecioMax(Math.max(...precios));

        // Leer parámetro de categoría desde URL
        const searchParams = new URLSearchParams(location.search);
        const categoriaParam = searchParams.get("categoria");

        if (categoriaParam) {
          const categoriaEncontrada = resCat.data.find(
            (cat) =>
              cat.nombre_categoria.toLowerCase() ===
              categoriaParam.toLowerCase()
          );
          if (categoriaEncontrada) {
            setCategoriasSeleccionadas([categoriaEncontrada.id_categoria]);
          }
        }
      } catch (error) {
        console.error("Error al cargar productos o categorías:", error);
      }
    };

    fetchData();
  }, [location.search]);

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
    const dentroDelRango =
      prod.precio_unitario >= precioMin && prod.precio_unitario <= precioMax;

    return coincideBusqueda && coincideCategoria && dentroDelRango;
  });

  return (
    <div className="tienda-page">
      <div className="ContTienda">
        <h1>Catálogo de productos</h1>
        <p>
          Mostrando {productosFiltrados.length} de {productos.length} productos
        </p>
      </div>

      <button
        className="tienda-filtros-toggle"
        onClick={() => setFiltrosOpen(!filtrosOpen)}
      >
        {filtrosOpen ? "Ocultar filtros ▲" : "Mostrar filtros ▼"}
      </button>

      <div className="tienda-contenido">
        {/* SIDEBAR FILTROS */}
        <aside className={`tienda-filtros ${filtrosOpen ? "open" : ""}`}>
          <div className="tienda-filtros-contenido">
            <h2 className="tienda-filtros-titulo">Filtros</h2>

            {/* Búsqueda */}
            <div className="tienda-busqueda">
              <label>Buscar producto: </label>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Ej. Bicicleta, casco..."
              />
            </div>

            {/* Categorías */}
            <div className="tienda-categorias">
              <h3>Categorías</h3>
              <ul>
                {categorias.map((cat) => (
                  <li key={cat.id_categoria}>
                    <input
                      type="checkbox"
                      id={`cat-${cat.id_categoria}`}
                      checked={categoriasSeleccionadas.includes(
                        cat.id_categoria
                      )}
                      onChange={() => toggleCategoria(cat.id_categoria)}
                    />
                    <label htmlFor={`cat-${cat.id_categoria}`}>
                      {cat.nombre_categoria}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Rango de precios */}
            <div className="tienda-precios">
              <p>
                Mostrando productos entre ${precioMin.toLocaleString("es-CO")} y{" "}
                ${precioMax.toLocaleString("es-CO")}
              </p>
              <h3>Rango de precios</h3>
              <div className="rango-precios">
                <label>Desde:</label>
                <input
                  type="number"
                  value={precioMin}
                  onChange={(e) => setPrecioMin(Number(e.target.value))}
                  min="0"
                />
                <input
                  type="number"
                  value={precioMax}
                  onChange={(e) => setPrecioMax(Number(e.target.value))}
                  min={precioMin}
                  max={Math.max(...productos.map((p) => p.precio_unitario), 0)}
                />
              </div>
            </div>

            {(categoriasSeleccionadas.length > 0 || busqueda) && (
              <button
                onClick={() => {
                  setCategoriasSeleccionadas([]);
                  setBusqueda("");
                  const precios = productos.map((p) => p.precio_unitario);
                  setPrecioMin(Math.min(...precios));
                  setPrecioMax(Math.max(...precios));
                }}
                className="tienda-btn-limpiar"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </aside>

        {/* PRODUCTOS */}
        <section className="tienda-productos">
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map((p) => (
              <div key={p.id_producto} className="tienda-card">
                <button
                  className="tienda-card-img"
                  onClick={() => navigate(`/producto/${p.id_producto}`)}
                >
                  <img
                    src={
                      p.imagen
                        ? `http://localhost:3000/uploads/productos/${p.imagen}`
                        : "/placeholder.png"
                    }
                    alt={p.nombre_producto}
                  />
                </button>

                <div className="tienda-card-body">
                  <div className="tienda-marca">
                    <h4>{p.marca}</h4>
                  </div>
                  <div className="tienda-nombre">
                    <h3>{p.nombre_producto}</h3>
                  </div>
                  <div className="tienda-card-cont">
                    <div className="tienda-card-info">
                      <p className="tienda-precio">
                        ${p.precio_unitario.toLocaleString("es-CO")}
                      </p>

                      {/* 🔥 ADAPTADO AQUÍ */}
                      <p className="tienda-stock">
                        {p.stock} en stock
                      </p>
                    </div>

                    <button
                      className="tienda-btn-add"
                      onClick={() =>
                        agregarUnidadAlCarrito(
                          p,
                          setCantidadCarrito,
                          mostrarToast
                        )
                      }
                    >
                      <img src="./public/IconCarritoBoton.svg" alt="" />
                      <p>Añadir al carrito</p>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="tienda-vacio">No se encontraron productos.</p>
          )}
        </section>
      </div>
    </div>
  );
}
