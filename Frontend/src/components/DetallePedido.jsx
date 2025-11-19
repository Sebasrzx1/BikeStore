import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import PanelCliente from "./PanelCliente.jsx";
import '../styles/DetallePedido.css'

const DetallePedido = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const { id } = useParams();

    const [pedido, setPedido] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const cargarPedido = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`http://localhost:3000/api/pedidos/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            // Backend devuelve: { success, message, pedido }
            setPedido(data.pedido);
            setItems(data.pedido.items || []);

        } catch (err) {
            console.error("Error al cargar detalle:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarPedido();
    }, []);

    if (loading) return <p>Cargando pedido...</p>;
    if (!pedido) return <p>No se encontró el pedido.</p>;

    return (
        <div className="contenedor-general">

            <div className="contenedor-panel-y-pedidos">
                <div className="contenedorPanel">
                    <PanelCliente user={user} onLogout={handleLogout} />
                </div>

                <div className="contenedor-detalle">
                    <div className="pedido">
                        <h1>PED - {pedido.id_pedido}</h1>
                        <p><strong>Estado:</strong> {pedido.estado}</p>
                        <p><strong>Fecha:</strong> {pedido.fecha}</p>
                        <p><strong>Total:</strong> ${pedido.total ?? "N/A"}</p>

                    </div>


                    <div className="contenedor-imgProductosName">
                        <h2>Productos del pedido</h2>

                        <div className="imagenes_pedido">
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

                        <div className="items-pedido">
                            {items.length === 0 ? (
                                <p>Este pedido no tiene productos.</p>
                            ) : (
                                items.map(item => (
                                    <div key={item.id_detalle} className="item-card">
                                        <p><strong> - {item.nombre_producto}</strong></p>
                                        <p>Cantidad: {item.cantidad}</p>
                                        <p>Precio unitario: ${item.precio_unitario}</p>
                                        <p>Subtotal: ${item.total_item}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <button id="btn-volver">Volver</button>
                </div>
            </div>

        </div>
    );
};

export default DetallePedido;
