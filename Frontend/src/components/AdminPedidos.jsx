import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/PedidosAdmin.css";

const estadosFiltro = ["todos", "En alistamiento", "En envío", "Entregados"];

const filtrosEstadosMap = {
  todos: null,
  "En alistamiento": ["En alistamiento"],
  "En envío": ["En envío"],
  Entregados: ["Entregados"],
};

const colorEstado = {
  "En alistamiento": "#ffb7b7ff",
  "En envío": "#a3b7ffff",
  Entregados: "#adffe5ff",
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
      const { data } = await axios.get(
        "http://localhost:3000/api/pedidos/todos",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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
        prev.map((p) =>
          p.id_pedido === id_pedido ? { ...p, estado: nuevoEstado } : p
        )
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

  if (cargando) {
    return (
      <div className="pedidos-container2">
        <p>Cargando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="pedidos-container2">
      <h3 className="titulo-pedidos2">Pedidos</h3>
      <div className="tabs2">
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

      <div className="lista-pedidos2">
        {pedidosFiltrados.length === 0 ? (
          <p className="sin-pedidos2">No hay pedidos para mostrar.</p>
        ) : (
          pedidosFiltrados.map((p) => (
            <div key={p.id_pedido} className="pedido-row2">
              <div className="pedido-info2">
                <div className="pedido-id2">PED-{p.id_pedido}</div>
                <div className="pedido-usuario2">{p.nombre_usuario}</div>
                <div className="pedido-fecha2">
                  {new Date(p.fecha).toLocaleDateString("es-CO")}
                </div>
              </div>

              <div className="pedido-valor2">
                $
                {p.total.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>

              <select
                value={p.estado}
                onChange={(e) => cambiarEstado(p.id_pedido, e.target.value)}
                disabled={cambiandoEstado === p.id_pedido}
                className="select-estado2"
                style={{
                  backgroundColor: colorEstado[p.estado] || "transparent",
                }}
              >
                <option value="En alistamiento">En alistamiento</option>
                <option value="En envío">En envío</option>
                <option value="Entregados">Entregados</option>
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
