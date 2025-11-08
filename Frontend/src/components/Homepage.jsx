import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Homepage.css";
import HeroSlider from "./Heroslider";
import FooterBikestore from "./FooterBikestore";

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
        <div className="heroTitulo">
          <h1>COMPRA POR CATÁLOGO</h1>
          <p>Encuentra exactamente lo que necesitas para tu viaje en bicicleta</p>
        </div>

        <div className="ContCategoria">
          
          <div className="categoria-item">
            <div className="ContIcon">
              <div className="icono">
                <img src="./public/IconBike.svg" alt="IconoBicicletas" />
              </div>
            </div>

              <div className="CategTitulo">
                <h4>Bicicletas</h4>
              </div>

              <div className="CategPar">
                <p>Explora nuestra amplia gama de bicicletas</p>
              </div>
              <div className="CategBoton">
                <p>Explorar</p>
              </div>
          </div>

          <div className="categoria-item">
            <div className="ContIcon">
              <div className="icono">
                <img src="./public/IconAccesori.svg" alt="IconoBicicletas" />
              </div>
            </div>

              <div className="CategTitulo">
                <h4>Acesorios</h4>
              </div>

              <div className="CategPar">
                <p>Equipo esencial para cada ocasión</p>
              </div>
              <div className="CategBoton">
                <p>Explorar</p>
              </div>
          </div>

          <div className="categoria-item">
            <div className="ContIcon">
              <div className="icono">
                <img src="./public/IconStem.svg" alt="IconoBicicletas" />
              </div>
            </div>

              <div className="CategTitulo">
                <h4>Repuestos</h4>
              </div>

              <div className="CategPar">
                <p>Hombre precavido vale x2</p>
              </div>
              <div className="CategBoton">
                <p>Explorar</p>
              </div>
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
                        <div className="card-img">
                          <img
                            src={`http://localhost:3000/${p.imagen}`}
                            alt={p.nombre_producto}
                          />
                        </div>
                        <div className="card-body">
                          <h4 className="marca">{p.marca}</h4>
                          <h3 className="nombre">{p.nombre_producto}</h3>
                          <div className="ContPrecioADD">
                            <div className="contprecio">
                              <p className="precio">
                                ${p.precio_unitario.toLocaleString("es-CO")}
                              </p>
                              <p className="stock">{p.entradas - p.salidas} en stock</p>
                            </div>
                            <div  className="btn-add">
                              <img src="./public/IconCarritoBoton.svg" alt="" />
                            <button>Añadir al carrito</button>
                            </div>
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
      <FooterBikestore />
    </div >
  );
};

export default Homepage;
