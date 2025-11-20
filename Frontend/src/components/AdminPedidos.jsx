import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/PedidosAdmin.css";

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 🔹 Obtener todos los pedidos
  const obtenerPedidos = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:3000/api/pedidos/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // El controlador devuelve { success: true, data: pedidos }
      setPedidos(Array.isArray(data.data) ? data.data : []);
      setCargando(false);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
      setCargando(false);
    }
  };

  // 🔹 Cambiar estado de un pedido
  const cambiarEstado = async (id_pedido, nuevoEstado) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/pedidos/${id_pedido}/estado`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      obtenerPedidos(); // refrescar lista
    } catch (error) {
      console.error("Error cambiando estado:", error);
    }
  };

  useEffect(() => {
    obtenerPedidos();
  }, []);

  if (cargando) return <p>Cargando pedidos...</p>;

  return (
    <div className="tabla-pedidos">
      <h1>Gestión de Pedidos</h1>

      {pedidos.length === 0 ? (
        <p>No hay pedidos registrados.</p>
      ) : (
        <div className="Cont-cardpedidos" >
          {pedidos.map((p) => (
            <div className="pedido-card1" key={p.id_pedido}>
              <div className="Cont-Client">
              <p><strong>ID Pedido:</strong> {p.id_pedido}</p>
              <p><strong></strong> {p.nombre_usuario}</p>
              <p><strong></strong> {new Date(p.fecha).toLocaleDateString("es-CO")}</p>
              </div>
              <div className="Cont-Detail">
              <p><strong>$</strong> ${p.total}</p>
              <p><strong></strong> {p.estado}</p>
              </div>

              <select
                value={p.estado}
                onChange={(e) => cambiarEstado(p.id_pedido, e.target.value)}
              >
                <option value="pendiente">Pendiente</option>
                <option value="procesando">Procesando</option>
                <option value="enviado">Enviado</option>
                <option value="completado">Completado</option>
                <option value="cancelado">Cancelado</option>
              </select>

              <button
                className="btn-detalle"
                onClick={() => window.location.href = `/admin/pedido/${p.id_pedido}`}
              >
                Ver detalles
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
