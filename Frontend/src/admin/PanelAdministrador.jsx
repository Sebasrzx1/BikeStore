import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "../styles/PanelAdministrador.css";
import AdminNavbar from "../components/AdminNavbar";

const PanelAdministrador = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [ingresosTotales, setIngresosTotales] = useState(0);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const resProductos = await axios.get(
          "http://localhost:3000/api/productos"
        );
        const resUsuarios = await axios.get(
          "http://localhost:3000/api/usuarios"
        );

        setProductos(resProductos.data);
        setUsuarios(resUsuarios.data);

        const ingresos = resProductos.data.reduce(
          (acc, p) => acc + p.precio_unitario * p.entradas,
          0
        );
        setIngresosTotales(ingresos);
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

  return (
    <div className="panel-admin">
      <AdminNavbar />
      <div className="ContAdmin">
        <header className="panel-header">
          <h1>⚙️ Panel de Administración</h1>
        </header>
        <main className="panel-main">
          <section className="panel-resumen">
            <h2>📊 Resumen general</h2>
            <div className="panel-metricas">
              <div className="panel-box ingresos">
                <h3>💰 Ingresos Totales</h3>
                <p>${ingresosTotales.toLocaleString("es-CO")}</p>
              </div>
              <div className="panel-box productos">
                <h3>📦 Productos Totales</h3>
                <p>{productosTotales}</p>
              </div>
              <div className="panel-box usuarios">
                <h3>👥 Usuarios Activos</h3>
                <p>{usuariosActivos}</p>
              </div>
              <div className="panel-box pedidos">
                <h3>📦 Pedidos Totales</h3>
                <p>0 (pendiente)</p>
              </div>
            </div>
          </section>

          <section className="panel-alertas">
            <h2>🚨 Alerta de Stock Bajo</h2>
            {productosConStockBajo.length === 0 ? (
              <p>Todos los productos tienen stock suficiente.</p>
            ) : (
              <ul>
                {productosConStockBajo.map((p) => (
                  <li key={p.id_producto}>
                    {p.nombre_producto} ({p.entradas - p.salidas} disponibles)
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default PanelAdministrador;
