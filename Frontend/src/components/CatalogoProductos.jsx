import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { agregarUnidadAlCarrito } from "../utils/carrito";
import "../styles/Tienda.css";
import { useToast } from "../context/ToastContext";
import InputSearch from "../components/InputSearch";
import Checkbox from "../components/Checkbox";

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
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });

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

  const limpiarFiltros = () => {
    setCategoriasSeleccionadas([]);
    setBusqueda("");

    // Restaurar precios originales
    if (productos.length > 0) {
      const precios = productos.map((p) => p.precio_unitario);
      setPrecioMin(Math.min(...precios));
      setPrecioMax(Math.max(...precios));
    }
  };

  return (
    <div className="tienda-page">
      <div className="ContTienda" data-aos="fade-up">
        <h1>Catálogo de productos</h1>
        <p>
          Mostrando {productosFiltrados.length} de {productos.length} productos
        </p>
      </div>

      <button
        className="tienda-filtros-toggle"
        onClick={() => setFiltrosOpen(!filtrosOpen)}
        data-aos="zoom-in"
      >
        {filtrosOpen ? "Ocultar filtros ▲" : "Mostrar filtros ▼"}
      </button>

      <div className="tienda-contenido" data-aos="fade-in">
        {/* SIDEBAR FILTROS */}
        <aside
          className={`tienda-filtros ${filtrosOpen ? "open" : ""}`}
          data-aos="slide-right"
        >
          <div className="tienda-filtros-contenido">
            <h2 className="tienda-filtros-titulo">Filtros</h2>

            {/* Búsqueda */}
            <div className="tienda-busqueda">
              <label htmlFor="buscar">Buscar producto:</label>
              <InputSearch
                id="buscar"
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
                    <Checkbox
                      id={`cat-${cat.id_categoria}`}
                      checked={categoriasSeleccionadas.includes(
                        cat.id_categoria
                      )}
                      onChange={() => toggleCategoria(cat.id_categoria)}
                      label={cat.nombre_categoria}
                    />
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
                <label htmlFor="rango-precio-max">Desde:</label>

                <div className="rango-slider">
                  <input
                    id="rango-precio-max"
                    type="range"
                    min={precioMin}
                    max={Math.max(
                      ...productos.map((p) => p.precio_unitario),
                      0
                    )}
                    value={precioMax}
                    onChange={(e) => setPrecioMax(Number(e.target.value))}
                    className="slider-max"
                  />

                  <div className="rango-valores">
                    <p>Mínimo: ${precioMin.toLocaleString("es-CO")}</p>
                    <p>Máximo: ${precioMax.toLocaleString("es-CO")}</p>
                  </div>
                </div>
              </div>

              <button className="btn-limpiar" onClick={limpiarFiltros}>
                Limpiar filtros
              </button>
            </div>
          </div>
        </aside>

        {/* PRODUCTOS */}
        <section className="tienda-productos" data-aos="fade-in">
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map((p, index) => {
              const sinStock = p.stock === 0;

              return (
                <div
                  key={p.id_producto}
                  className="tienda-card"
                  data-aos="zoom-in"
                  data-aos-delay={index * 100}
                >
                  <div className="tienda-card-img-wrapCatal">
                    {sinStock && (
                      <span className="etiqueta-sin-stockCatal">Sin Stock</span>
                    )}

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
                  </div>

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

                        <p className="tienda-stock">{p.stock} en stock</p>
                      </div>

                      {/* BOTÓN CAMBIANTE */}
                      <button
                        disabled={sinStock}
                        className={`tienda-btn-add ${sinStock ? "agotado" : ""
                          }`}
                        onClick={() =>
                          agregarUnidadAlCarrito(
                            p,
                            setCantidadCarrito,
                            mostrarToast
                          )
                        }
                      >
                        <img src="./public/IconCarritoBoton.svg" alt="" />
                        <p>{sinStock ? "Agotado" : "Añadir al carrito"}</p>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="tienda-vacio" data-aos="fade-in">
              No se encontraron productos.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
