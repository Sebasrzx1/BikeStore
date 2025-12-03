import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/CuentaCliente.css";
import DireccionEnvio from "./DireccionEnvio.jsx";
import PanelCliente from "./PanelCliente.jsx";

const CuentaCliente = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    pais: "",
    email: "",
    direccion: "",
    ciudad: "",
    departamento: "",
    codigo_postal: "",
  });

  const [contraseñaActual, setContraseñaActual] = useState("");
  const [nuevaContraseña, setNuevaContraseña] = useState("");
  const [mensaje, setMensaje] = useState("");

  // OBTENER PERFIL
  const obtenerDatosPerfil = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMensaje("❌ No estás autenticado");
        navigate("/login");
        return;
      }

      const res = await fetch(
        "http://localhost:3000/api/usuarios/perfil/mis-datos",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Error al obtener datos del usuario");
      }

      const data = await res.json();
      const perfil = data.usuario ? data.usuario : data;

      setUsuario({
        nombre: perfil.nombre || "",
        apellido: perfil.apellido || "",
        telefono: perfil.telefono || "",
        pais: perfil.pais || "",
        email: perfil.email || "",
        direccion: perfil.direccion || "",
        ciudad: perfil.ciudad || "",
        departamento: perfil.departamento || "",
        codigo_postal: perfil.codigo_postal || "",
      });
    } catch (error) {
      console.error("Error al obtener perfil:", error);
      setMensaje("❌ No se pudo cargar la información del usuario");
    }
  };

  useEffect(() => {
    obtenerDatosPerfil();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Manejador de inputs
  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  // GUARDAR CAMBIOS
  const handleGuardar = async (e) => {
    e.preventDefault();
    setMensaje("Guardando cambios...");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No autenticado");

      const payload = {};

      if (usuario.nombre?.trim()) payload.nombre = usuario.nombre.trim();
      if (usuario.apellido?.trim()) payload.apellido = usuario.apellido.trim();
      if (usuario.telefono?.toString().trim())
        payload.telefono = usuario.telefono.toString().trim();
      if (usuario.pais?.trim()) payload.pais = usuario.pais.trim();

      if (contraseñaActual && nuevaContraseña) {
        payload.contraseñaActual = contraseñaActual;
        payload.nuevaContraseña = nuevaContraseña;
      }

      if (Object.keys(payload).length === 0) {
        setMensaje("No hay cambios para guardar.");
        return;
      }

      const res = await fetch(
        "http://localhost:3000/api/usuarios/perfil/actualizar",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Error al actualizar perfil");

      setMensaje("✅ Perfil actualizado con éxito");
      setContraseñaActual("");
      setNuevaContraseña("");

      await obtenerDatosPerfil();

      updateUser({
        nombre: usuario.nombre || user?.nombre,
        apellido: usuario.apellido || user?.apellido,
      });
    } catch (error) {
      console.error("Error al guardar perfil:", error);
      setMensaje(`❌ ${error.message}`);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="cuenta-cliente">
      <div className="contenedor-cuenta-cliente">

        <div className="contendor-componente-panelCliente">
          <PanelCliente user={user} onLogout={handleLogout} />
        </div>

        <div className="contajustes">
          <div className="contenedor-datos-personales">

            <div className="encabezado">
              <h1>Ajustes de Cuenta</h1>
              <p>Administra tus datos personales y dirección de envío</p>
            </div>

            {/* FORMULARIO EDITABLE */}
            <div className="contenedor-formularios">
              <h3>Editar información personal</h3>

              <form onSubmit={handleGuardar} className="cuenta-form">

                <label htmlFor="nombre">Nombre:</label>
                <input
                  id="nombre"
                  type="text"
                  name="nombre"
                  value={usuario.nombre}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="apellido">Apellido:</label>
                <input
                  id="apellido"
                  type="text"
                  name="apellido"
                  value={usuario.apellido}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="telefono">Teléfono:</label>
                <input
                  id="telefono"
                  type="text"
                  name="telefono"
                  value={usuario.telefono}
                  onChange={handleChange}
                />

                <label htmlFor="pais">País:</label>
                <input
                  id="pais"
                  type="text"
                  name="pais"
                  value={usuario.pais}
                  onChange={handleChange}
                />

                <h4>Cambiar Contraseña</h4>

                <label htmlFor="passActual">Contraseña actual:</label>
                <input
                  id="passActual"
                  type="password"
                  value={contraseñaActual}
                  onChange={(e) => setContraseñaActual(e.target.value)}
                />

                <label htmlFor="passNueva">Nueva contraseña:</label>
                <input
                  id="passNueva"
                  type="password"
                  value={nuevaContraseña}
                  onChange={(e) => setNuevaContraseña(e.target.value)}
                />

                <button type="submit" className="btn-guardar">
                  Guardar cambios
                </button>
              </form>

              {mensaje && <p className="mensaje">{mensaje}</p>}
            </div>

            {/* DIRECCIÓN DE ENVÍO */}
            <DireccionEnvio
              usuario={usuario}
              onActualizar={obtenerDatosPerfil}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default CuentaCliente;
