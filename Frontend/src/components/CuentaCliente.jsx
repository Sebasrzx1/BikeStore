import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/CuentaCliente.css";
import DireccionEnvio from "./DireccionEnvio.jsx";
import PanelCliente from "./PanelCliente.jsx";

const CuentaCliente = () => {
  const { user, logout, updateUser } = useAuth(); // contexto
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

  // FUNCION: obtén datos del perfil (la puedes reutilizar)
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

      // Si la ruta devuelve { success: true, usuario: {...} } o solo el objeto,
      // ajusta según tu respuesta real. Aquí soporte ambos casos:
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


      // si quieres también sincronizar con el contexto (opcional)
      // updateUser({ nombre: perfil.nombre, apellido: perfil.apellido });
    } catch (error) {
      console.error("Error al obtener perfil:", error);
      setMensaje("❌ No se pudo cargar la información del usuario");
    }
  };

  // carga inicial
  useEffect(() => {
    obtenerDatosPerfil();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // solo al montar

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  // Guardar cambios: enviamos solo campos no vacíos (evita sobrescribir con "")
  const handleGuardar = async (e) => {
    e.preventDefault();
    setMensaje("Guardando cambios...");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No autenticado");

      // Construimos payload solo con campos modificables/no vacíos
      const payload = {};
      if (usuario.nombre && usuario.nombre.trim() !== "")
        payload.nombre = usuario.nombre.trim();
      if (usuario.apellido && usuario.apellido.trim() !== "")
        payload.apellido = usuario.apellido.trim();
      if (
        typeof usuario.telefono !== "undefined" &&
        usuario.telefono !== null &&
        usuario.telefono.toString().trim() !== ""
      )
        payload.telefono = usuario.telefono.toString().trim();
      if (usuario.pais && usuario.pais.trim() !== "")
        payload.pais = usuario.pais.trim();

      // Contraseña solo si se proporcionó
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

      // refrescar datos del perfil para mantener UI consistente
      await obtenerDatosPerfil();

      // actualizar contexto para que el nombre arriba cambie inmediatamente
      updateUser({
        nombre: usuario.nombre || (user && user.nombre),
        apellido: usuario.apellido || (user && user.apellido),
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
      
      <div className="contenedor-cuenta-cliente">
        <div className="contendor-componente-panelCliente">
          <PanelCliente user={user} onLogout={handleLogout} />
        </div>
        <div className="contajustes">
        <div className="contenedor-datos-personales">
          <div className="encabezado">
            <h1>Ajustes de Cuenta</h1>
            <p>Administra tus datos personles y direccion de envio</p>
          </div>

          {/* formulario para editar */}
          <div className="contenedor-formulario">
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
          </div>

          {/* componente DireccionEnvio fuera del form */}
          <DireccionEnvio usuario={usuario} onActualizar={obtenerDatosPerfil} />

        </div>
      </div>

      </div>


    </div>
  );
};

export default CuentaCliente;
