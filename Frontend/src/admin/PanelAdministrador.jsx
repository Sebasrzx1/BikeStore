import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "../styles/PanelAdministrador.css";
import AdminNavbar from "../components/AdminNavbar";
import AdminPedidos from "../components/AdminPedidos";

const PanelAdministrador = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [ingresosTotales, setIngresosTotales] = useState(0);
  const [pedidosTotales, setPedidosTotales] = useState(0);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        // 🔹 Productos
        const resProductos = await axios.get(
          "http://localhost:3000/api/productos"
        );

        // 🔹 Categorías
        const resCategorias = await axios.get(
          "http://localhost:3000/api/categorias"
        );
        setCategorias(resCategorias.data);

        // 🔹 Usuarios
        const resUsuarios = await axios.get(
          "http://localhost:3000/api/usuarios"
        );

        // 🔹 Pedidos
        const token = localStorage.getItem("token");
        const resPedidos = await axios.get(
          "http://localhost:3000/api/pedidos/todos",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setProductos(resProductos.data);
        setUsuarios(resUsuarios.data);

        // Actualiza los pedidos totales reales
        setPedidosTotales(resPedidos.data.data.length || 0);

        // 💰 Calcular ingresos
        const ventas = resProductos.data.reduce(
          (acc, p) => acc + (p.salidas || 0) * (p.precio_unitario || 0),
          0
        );

        setIngresosTotales(ventas);
      } catch (error) {
        console.error("Error al cargar datos del panel:", error);
      }
    };

    fetchDatos();
  }, []);

  const productosTotales = productos.length;
  const usuariosActivos = usuarios.length;
  const productosConStockBajo = productos.filter(
    (p) => p.entradas - p.salidas <= 3
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const obtenerNombreCategoria = (id) => {
    const cat = categorias.find((c) => Number(c.id_categoria) === Number(id));
    return cat ? cat.nombre_categoria : "Sin categoría";
  };

  return (
    <div className="panel-admin">
      <AdminNavbar />
      <div className="ContAdmin">
        <header className="panel-header">
          <h1>Panel de Administración</h1>
        </header>

        <main className="panel-main">
          {/* === MÉTRICAS === */}
          <section className="panel-resumen">
            <h2>Resumen general</h2>

            <div className="panel-metricas">
              <div className="panel-box">
                <h3>Ingresos Totales</h3>
                <p>${ingresosTotales.toLocaleString("es-CO")}</p>
              </div>

              <div className="panel-box">
                <h3>Productos Totales</h3>
                <p>{productosTotales}</p>
              </div>

              <div className="panel-box">
                <h3>Usuarios Activos</h3>
                <p>{usuariosActivos}</p>
              </div>

              <div className="panel-box">
                <h3>Pedidos Totales</h3>
                <p>{pedidosTotales}</p>
              </div>
            </div>
          </section>

          {/* === STOCK BAJO === */}
          <div className="ContPaneles">
            <AdminPedidos />

            <section className="panel-alertas">
              <h2>Alerta de Stock Bajo</h2>
              {productosConStockBajo.length === 0 ? (
                <p>Todos los productos tienen stock suficiente.</p>
              ) : (
                <ul>
                  {productosConStockBajo.map((p) => (
                    <li key={p.id_producto} className="stock-item">
                      <div className="stock-info">
                        <span className="stock-nombre">
                          {p.nombre_producto}
                        </span>
                        <span className="stock-categoria">
                          {obtenerNombreCategoria(p.id_categoria)}
                        </span>
                      </div>
                      <span className="stock-cantidad">
                        {p.entradas - p.salidas} en stock
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PanelAdministrador;
