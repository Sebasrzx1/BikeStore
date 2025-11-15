import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import PanelCliente from "./PanelCliente.jsx";
import "../styles/MisPedidos.css";
import { useNavigate } from "react-router-dom";

const MisPedidos = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [pedidos, setPedidos] = useState([]);
    const [filtro, setFiltro] = useState("todos");

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

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

    const pedidosFiltrados =
        filtro === "todos"
            ? pedidos
            : pedidos.filter((p) => p.estado === filtro);

    const formatearFecha = (isoString) => {
        const fecha = new Date(isoString);
        return fecha.toLocaleDateString("es-CO", {
            year: "numeric",
            month: "numeric",
            day: "numeric"
        });
    };

    return (
        <div className="contenedor-general">

            <div className="contenedor-panel-y-pedidos">

                <div className="contenedorPanel">
                    <PanelCliente user={user} onLogout={handleLogout} />
                </div>

                <div className="contenedor-pedidos">
                    <h1>Mis pedidos</h1>

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

                                    {/* SLIDE DE IMÁGENES */}
                                    <div className="slider-container">
                                        {pedido.items && pedido.items.length > 0 ? (
                                            pedido.items.map((item, index) => (
                                                <img
                                                    key={index}
                                                    src={`http://localhost:3000/uploads/productos/${item.imagen_url}`}
                                                    className="slide-img"
                                                    alt={item.nombre_producto}
                                                />
                                            ))
                                        ) : (
                                            <img
                                                src="/sin-imagen.png"
                                                className="slide-img"
                                                alt="Sin imagen"
                                            />
                                        )}
                                    </div>

                                    {/* INFO DEL PEDIDO */}
                                    <div className="pedido-info">
                                        <div className="No_pedido_fecha">
                                            <h3>PED - {pedido.id_pedido}</h3>
                                            <p>{user.nombre}</p>
                                            <p>{formatearFecha(pedido.fecha)}</p>

                                        </div>
                                        <div className="Estado_total_verDetalle">

                                            <p id="totalPedido">${pedido.total}</p>

                                            <p id="estado">{pedido.estado}</p>

                                            <button
                                                className="btn-detalles"
                                                onClick={() => navigate(`/mis-pedidos/${pedido.id_pedido}`)}>
                                                Ver detalles
                                            </button>
                                        </div>



                                    </div>
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
