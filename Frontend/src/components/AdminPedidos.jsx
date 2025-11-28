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

  // Modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [detallePedido, setDetallePedido] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

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

  const abrirModal = async (id_pedido) => {
    setModalAbierto(true);
    setCargandoDetalle(true);
    setDetallePedido(null);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3000/api/pedidos/${id_pedido}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.data.pedido) {
        throw new Error("Pedido no encontrado");
      }

      setDetallePedido(res.data.pedido);
    } catch (err) {
      console.error("Error al cargar detalle:", err);
      alert("No se pudo cargar el detalle del pedido");
    } finally {
      setCargandoDetalle(false);
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

              {/* Botón para abrir el modal */}
              <button
                className="btn-detalle2"
                onClick={() => abrirModal(p.id_pedido)}
              >
                Ver detalle
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalAbierto && (
        <div className="modal-detalle-overlay">
          <div className="modal-detalle">
            <button
              className="cerrar-modal"
              onClick={() => setModalAbierto(false)}
            >
              ✕
            </button>

            {cargandoDetalle ? (
              <p>Cargando detalles...</p>
            ) : !detallePedido ? (
              <p>No se encontró el pedido.</p>
            ) : (
              <>
                <h2>PED - {detallePedido.id_pedido}</h2>
                <p><strong>Usuario:</strong> {detallePedido.nombre} {detallePedido.apellido} </p>
                <p><strong>Dirección:</strong> {detallePedido.direccion}</p>
                <p><strong>Estado:</strong> {detallePedido.estado}</p>
                <p><strong>Fecha:</strong> {new Date(detallePedido.fecha).toLocaleString()}</p>
                <p><strong>Total:</strong> ${detallePedido.total}</p>

                <h3>Productos</h3>

                <div className="detalle-items-container">
                  {detallePedido.items && detallePedido.items.length > 0 ? (
                    detallePedido.items.map((item) => (
                      <div key={item.id_detalle} className="item-modal">
                        <img
                          src={`http://localhost:3000/uploads/productos/${item.imagen_url}`}
                          alt={item.nombre_producto}
                          className="img-item-modal"
                        />
                        <div>
                          <p><strong>{item.nombre_producto}</strong></p>
                          <p>Cantidad: {item.cantidad}</p>
                          <p>Precio: ${item.precio_unitario}</p>
                          <p>Subtotal: ${item.total_item}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Este pedido no tiene productos.</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}