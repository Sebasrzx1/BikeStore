import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import PanelCliente from "./PanelCliente.jsx";
import "../styles/MisPedidos.css";
import { useNavigate } from "react-router-dom";

const MisPedidos = () => {
    const { user } = useAuth();
    const [pedidos, setPedidos] = useState([]);
    const [filtro, setFiltro] = useState("todos");
    const navigate = useNavigate()
    const obtenerPedidos = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No autenticado");

            const res = await fetch("http://localhost:3000/api/pedidos/mis-pedidos", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Error al obtener pedidos");

            setPedidos(data.pedidos || []);
        } catch (error) {
            console.error("Error cargando pedidos:", error);
        }
    };

    useEffect(() => {
        obtenerPedidos();
    }, []);

    // Filtrar pedidos según estado
    const pedidosFiltrados =
        filtro === "todos"
            ? pedidos
            : pedidos.filter((p) => p.estado === filtro);

    return (
        <div className="contenedor-general">

            <div className="contenedor-panel-y-pedidos">
                {/* Panel a la izquierda */}
                <div className="contenedorPanel">
                    <PanelCliente user={user} />
                </div>

                {/* Contenido de pedidos */}
                <div className="contenedor-pedidos">
                    <h1>Mis pedidos</h1>

                    {/* Barra de filtros */}
                    <div className="filtros">
                        <button onClick={() => setFiltro("todos")}>Todos</button>
                        <button onClick={() => setFiltro("En alistamiento")}>En alistamiento</button>
                        <button onClick={() => setFiltro("En envío")}>En envío</button>
                        <button onClick={() => setFiltro("Entregado")}>Entregados</button>
                    </div>

                    <div className="lista-pedidos">
                        {pedidosFiltrados.length === 0 ? (
                            <p>No hay pedidos con este estado.</p>
                        ) : (
                            pedidosFiltrados.map((pedido) => (
                                <div key={pedido.id_pedido} className="pedido-card">
                                    <h3>Pedido #{pedido.id_pedido}</h3>
                                    <p><strong>Estado:</strong> {pedido.estado}</p>
                                    <p><strong>Fecha:</strong> {pedido.fecha}</p>
                                    <p><strong>Total:</strong> ${pedido.total}</p>
                                    <button
                                        className="btn-detalles" onClick={() => navigate(`/mis-pedidos/${pedido.id_pedido}`)}>
                                        Ver detalles
                                    </button>

                                </div>
                            ))
                        )}
                    </div>

                </div>

            </div>



        </div>
    );
};

export default MisPedidos;
