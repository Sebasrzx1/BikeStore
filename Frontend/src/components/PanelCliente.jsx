// src/components/CuentaHeader.jsx
import React from "react";
import "../styles/PanelCliente.css";
import { useNavigate } from "react-router-dom";

const PanelCliente = ({ user, onLogout }) => {
    const navigate = useNavigate()
    if (!user) {
        return <p>No hay informacion del usuario</p>
    }

    return (
        <div className="contenedor-panel">
            {user ? (
                <>

                    <div className="name-correo">
                        <div className="icon-perfil-panel">
                            <img src="/PerfilPanel.png" alt="Icono-perfil" />
                        </div>

                        <p>!Hola! bienvenido {user.nombre}</p>

                        <h1>
                            {user.nombre} {user.apellido}
                        </h1>
                        <p>
                            {user.email}
                        </p>
                    </div>

                </>
            ) : (
                <p>No hay información del usuario</p>
            )}

            <div className="options">
                <button onClick={() => navigate("/mis-pedidos")}>Mis pedidos</button>
                <button id="btn-ajuste-cuenta" onClick={() => navigate("/cuenta")}>Ajuste de cuenta</button>
                <button onClick={onLogout} className="btn-logout">
                    Cerrar sesión
                </button>
            </div>

        </div>
    );
};

export default PanelCliente;
