// src/components/CuentaCliente.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/CuentaCliente.css";

const CuentaCliente = () => {
  const { user, logout, updateUser } = useAuth(); // ✅ dentro del componente
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    pais: "",
    email: "",
  });

  const [contraseñaActual, setContraseñaActual] = useState("");
  const [nuevaContraseña, setNuevaContraseña] = useState("");
  const [mensaje, setMensaje] = useState("");

  // 🔹 Cargar información actual del usuario desde el backend
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMensaje("❌ No estás autenticado");
          navigate("/login");
          return;
        }

        const res = await fetch("http://localhost:3000/api/usuarios/perfil/mis-datos", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          // intenta leer mensaje del servidor si lo envía
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || "Error al obtener datos del usuario");
        }

        const data = await res.json();
        // Aseguramos que el objeto tenga las propiedades que usamos
        setUsuario({
          nombre: data.nombre || "",
          apellido: data.apellido || "",
          telefono: data.telefono || "",
          pais: data.pais || "",
          email: data.email || "",
        });
      } catch (error) {
        console.error("Error al obtener perfil:", error);
        setMensaje("❌ No se pudo cargar la información del usuario");
      }
    };

    obtenerDatos();
  }, [navigate]);

  // 🔹 Manejar cambios en los inputs
  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  // 🔹 Guardar cambios en el perfil
  const handleGuardar = async (e) => {
    e.preventDefault();
    setMensaje("Guardando cambios...");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No autenticado");

      const res = await fetch("http://localhost:3000/api/usuarios/perfil/actualizar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          telefono: usuario.telefono,
          pais: usuario.pais,
          contraseñaActual,
          nuevaContraseña,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al actualizar perfil");
      }

      // Actualizamos UI y contexto con los nuevos datos
      setMensaje("✅ Perfil actualizado con éxito");
      setContraseñaActual("");
      setNuevaContraseña("");

      // Actualizamos el contexto (y localStorage) para que otros componentes vean los cambios al instante
      updateUser({
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        // si quieres agregar más campos al contexto, agrégalos aquí
      });
    } catch (error) {
      console.error("Error al guardar perfil:", error);
      setMensaje(`❌ ${error.message}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="cuenta-cliente">
      <h2>Mi Cuenta</h2>

      {/* sección superior que muestra nombre y email del contexto */}
      {user ? (
        <>
          <p>
            <strong>Nombre:</strong> {user.nombre} {user.apellido}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </>
      ) : (
        <p>No hay información del usuario</p>
      )}

      {/* formulario para editar */}
      <h3>Editar información personal</h3>
      <form onSubmit={handleGuardar} className="cuenta-form">
        <label>Nombre:</label>
        <input
          type="text"
          name="nombre"
          value={usuario.nombre || ""}
          onChange={handleChange}
          required
        />

        <label>Apellido:</label>
        <input
          type="text"
          name="apellido"
          value={usuario.apellido || ""}
          onChange={handleChange}
          required
        />

        <label>Teléfono:</label>
        <input
          type="text"
          name="telefono"
          value={usuario.telefono || ""}
          onChange={handleChange}
        />

        <label>País:</label>
        <input
          type="text"
          name="pais"
          value={usuario.pais || ""}
          onChange={handleChange}
        />

        <h4>Cambiar Contraseña</h4>
        <label>Contraseña actual:</label>
        <input
          type="password"
          value={contraseñaActual}
          onChange={(e) => setContraseñaActual(e.target.value)}
        />

        <label>Nueva contraseña:</label>
        <input
          type="password"
          value={nuevaContraseña}
          onChange={(e) => setNuevaContraseña(e.target.value)}
        />

        <button type="submit" className="btn-guardar">
          Guardar cambios
        </button>
      </form>

      {mensaje && <p className="mensaje">{mensaje}</p>}

      <button onClick={handleLogout} className="btn-logout">
        Cerrar sesión
      </button>
    </div>
  );
};

export default CuentaCliente;
