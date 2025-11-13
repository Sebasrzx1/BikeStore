// src/components/CuentaHeader.jsx
import React from "react";
import "../styles/PanelCliente.css";

const PanelCliente = ({ user, onLogout }) => {
    if (!user) {
        return <p>No hay informacion del usuario</p>
    }

    return (
        <div className="contenedor-panel">
            {user ? (
                <>
                    <div className="name-correo">
                        <div className="icon-perfil-panel">
                            <img src="./public/PerfilPanel.png" alt="" />
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
                <button>Mis pedidos</button>
                <button>Ajuste de cuenta</button>
                <button onClick={onLogout} className="btn-logout">
                    Cerrar sesión
                </button>
            </div>

        </div>
    );
};

export default PanelCliente;
