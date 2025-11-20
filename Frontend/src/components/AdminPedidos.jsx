import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/PedidosAdmin.css";

const estadosFiltro = ["todos", "por despachar", "en envío", "entregados"];

const filtrosEstadosMap = {
  todos: null,
  "por despachar": ["pendiente", "procesando"],
  "en envío": ["enviado"],
  entregados: ["entregado", "completado"],
};

const colorEstado = {
  pendiente: "#ccc",
  procesando: "#bbb",
  enviado: "#a3d2ca",
  completado: "#3aafa9",
  cancelado: "#e63946",
  entregado: "#e63946",
};

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState("todos");
  const [cambiandoEstado, setCambiandoEstado] = useState(null);

  const obtenerPedidos = async () => {
    try {
      setCargando(true);
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:3000/api/pedidos/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPedidos(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
      alert("Error al cargar pedidos");
    } finally {
      setCargando(false);
    }
  };

  const cambiarEstado = async (id_pedido, nuevoEstado) => {
    setCambiandoEstado(id_pedido);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/pedidos/${id_pedido}/estado`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPedidos((prev) =>
        prev.map((p) => (p.id_pedido === id_pedido ? { ...p, estado: nuevoEstado } : p))
      );
    } catch (error) {
      console.error("Error cambiando estado:", error);
      alert("Error al cambiar estado");
    } finally {
      setCambiandoEstado(null);
    }
  };

  useEffect(() => {
    obtenerPedidos();
  }, []);

  const estadosFiltrados = filtrosEstadosMap[filtro];
  const pedidosFiltrados = estadosFiltrados
    ? pedidos.filter((p) => estadosFiltrados.includes(p.estado))
    : pedidos;

  if (cargando)
    return (
      <div className="pedidos-container">
        <p>Cargando pedidos...</p>
      </div>
    );

  return (
    <div className="pedidos-container">
      <h3 className="titulo-pedidos">Pedidos</h3>
      <div className="tabs">
        {estadosFiltro.map((e) => (
          <button
            key={e}
            className={`tab-btn ${filtro === e ? "active" : ""}`}
            onClick={() => setFiltro(e)}
          >
            {e.charAt(0).toUpperCase() + e.slice(1)}
          </button>
        ))}
      </div>

      <div className="lista-pedidos">
        {pedidosFiltrados.length === 0 ? (
          <p className="sin-pedidos">No hay pedidos para mostrar.</p>
        ) : (
          pedidosFiltrados.map((p) => (
            <div key={p.id_pedido} className="pedido-row">
              <div className="pedido-info">
                <div className="pedido-id">PED-{p.id_pedido}</div>
                <div className="pedido-usuario">{p.nombre_usuario}</div>
                <div className="pedido-fecha">
                  {new Date(p.fecha).toLocaleDateString("es-CO")}
                </div>
              </div>

              <div className="pedido-valor">
                ${p.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>

              <select
                value={p.estado}
                onChange={(e) => cambiarEstado(p.id_pedido, e.target.value)}
                disabled={cambiandoEstado === p.id_pedido}
                className="select-estado"
              >
                <option value="pendiente">Pendiente</option>
                <option value="procesando">Procesando</option>
                <option value="enviado">Enviado</option>
                <option value="completado">Completado</option>
                <option value="cancelado">Cancelado</option>
                <option value="entregado">Entregado</option>
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
