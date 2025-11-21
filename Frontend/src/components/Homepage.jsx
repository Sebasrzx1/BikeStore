import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Homepage.css";
import { agregarUnidadAlCarrito } from "../utils/carrito";
import { useNavigate, useLocation } from "react-router-dom";
import HeroSlider from "./HeroSlider";
import { useToast } from "../context/ToastContext";

const Homepage = ({ setCantidadCarrito }) => {
  const [productos, setProductos] = useState([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { mostrarToast } = useToast();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/productos");
        setProductos(res.data);

        // Leer categoría desde URL
        const searchParams = new URLSearchParams(location.search);
        const categoriaParam = searchParams.get("categoria");

        if (categoriaParam) {
          const categoriaMap = {
            bicicletas: 1,
            repuestos: 2,
            accesorios: 3,
          };
          const idCategoria = categoriaMap[categoriaParam.toLowerCase()];
          if (idCategoria) {
            setCategoriasSeleccionadas([idCategoria]);
          }
        }
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProductos();
  }, [location.search]);

  const categoriasPermitidasIds = [1, 2, 3];

  // ADAPTADO: antes ordenaba por salidas, que ya no existe.
  const productosFiltrados = productos
    .filter((p) => categoriasPermitidasIds.includes(Number(p.id_categoria)))
    .sort(() => 0); // mantiene orden sin usar salidas

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
        <div className="heroTitulo">
          <h1>COMPRA POR CATÁLOGO</h1>
          <p>Encuentra exactamente lo que necesitas para tu viaje en bicicleta</p>
        </div>

        <div className="ContCategoria">
          {/* Bicicletas */}
          <div className="categoria-item">
            <div className="ContIcon">
              <div className="icono">
                <img src="../IconBike.svg" alt="IconoBicicletas" />
              </div>
            </div>
            <div
              className="CategTitulo"
              onClick={() => navigate("/catalogo?categoria=bicicletas")}
            >
              <h4>Bicicletas</h4>
            </div>
            <div className="CategPar">
              <p>Explora nuestra amplia gama de bicicletas</p>
            </div>
            <button
              className="CategBoton"
              onClick={() => navigate("/catalogo?categoria=bicicletas")}
            >
              <p>Explorar</p>
            </button>
          </div>

          {/* Accesorios */}
          <div className="categoria-item">
            <div className="ContIcon">
              <div className="icono">
                <img src="./public/IconAccesori.svg" alt="IconoAccesorios" />
              </div>
            </div>
            <div
              className="CategTitulo"
              onClick={() => navigate("/catalogo?categoria=accesorios")}
            >
              <h4>Accesorios</h4>
            </div>
            <div className="CategPar">
              <p>Equipo esencial para cada ocasión</p>
            </div>
            <button
              className="CategBoton"
              onClick={() => navigate("/catalogo?categoria=accesorios")}
            >
              <p>Explorar</p>
            </button>
          </div>

          {/* Repuestos */}
          <div className="categoria-item">
            <div className="ContIcon">
              <div className="icono">
                <img src="./public/IconStem.svg" alt="IconoRepuestos" />
              </div>
            </div>
            <div
              className="CategTitulo"
              onClick={() => navigate("/catalogo?categoria=repuestos")}
            >
              <h4>Repuestos</h4>
            </div>
            <div className="CategPar">
              <p>Hombre precavido vale x2</p>
            </div>
            <button
              className="CategBoton"
              onClick={() => navigate("/catalogo?categoria=repuestos")}
            >
              <p>Explorar</p>
            </button>
          </div>
        </div>
      </section>

      <section className="productos-lista">
        <div className="SectProducTitulo">
          <h1>PRODUCTOS POPULARES</h1>
          <p>Los productos favoritos de nuestra comunidad</p>
        </div>

        <div className="ContPopul">
          {Object.entries(productosPorCategoria).map(([id, items]) => {
            let nombreCategoria = "";
            if (id === "1") nombreCategoria = "Bicicletas";
            if (id === "2") nombreCategoria = "Repuestos";
            if (id === "3") nombreCategoria = "Accesorios";

            return (
              <div key={id} className="categoria-seccion">
                <h3 className="titulocategoria">{nombreCategoria}</h3>
                <div className="productos-grid">
                  {items.map((p) => (
                    <div key={p.id_producto} className="cardProductos">
                      <button
                        className="card-img"
                        onClick={() => navigate(`/producto/${p.id_producto}`)}
                      >
                        <img
                          src={`http://localhost:3000/uploads/productos/${p.imagen}`}
                          alt={p.nombre_producto}
                        />
                      </button>

                      <div className="card-body">
                        <h4 className="marca">{p.marca}</h4>
                        <h3 className="nombre">{p.nombre_producto}</h3>

                        <div className="ContPrecioADD">
                          <div className="contprecio">
                            <p className="precio">
                              ${p.precio_unitario.toLocaleString("es-CO")}
                            </p>

                            {/* ✔️ MOSTRAR STOCK (ya funciona en tu backend) */}
                            <p className="stock">{p.stock} en stock</p>
                          </div>

                          <button
                            className="btn-add"
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
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Homepage;
