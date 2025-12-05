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
  const [confirmarNuevaContraseña, setConfirmarNuevaContraseña] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState({}); // Estado para errores de validación
  const [modalExito, setModalExito] = useState(false); // Nuevo estado para modal de éxito

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
        pais: perfil.pais || "Colombia", // Valor por defecto si no hay
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

  // Función para validar un campo específico
  const validarCampo = (campo, valor) => {
    const nuevosErrores = { ...errores };

    switch (campo) {
      case "nombre":
        if (!valor.trim()) {
          nuevosErrores.nombre = "El nombre es obligatorio.";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(valor.trim())) {
          nuevosErrores.nombre = "El nombre solo puede contener letras y espacios.";
        } else if (valor.trim().length < 2 && valor.trim()) {
          nuevosErrores.nombre = "El nombre debe tener al menos 2 caracteres.";
        } else {
          delete nuevosErrores.nombre;
        }
        break;
      case "apellido":
        if (!valor.trim()) {
          nuevosErrores.apellido = "El apellido es obligatorio.";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(valor.trim())) {
          nuevosErrores.apellido = "El apellido solo puede contener letras y espacios.";
        } else if (valor.trim().length < 2 && valor.trim()) {
          nuevosErrores.apellido = "El apellido debe tener al menos 2 caracteres.";
        } else {
          delete nuevosErrores.apellido;
        }
        break;
      case "telefono":
        if (valor && !/^\d*$/.test(valor.toString().trim())) {
          nuevosErrores.telefono = "El teléfono debe contener solo números.";
        } else if (valor && valor.toString().trim().length > 15) {
          nuevosErrores.telefono = "El teléfono no puede tener más de 15 dígitos.";
        } else if (valor && valor.toString().trim().length < 7 && valor.toString().trim()) {
          nuevosErrores.telefono = "El teléfono debe tener al menos 7 dígitos.";
        } else {
          delete nuevosErrores.telefono;
        }
        break;
      case "pais":
        // Como es un select, no hay validación de caracteres, pero si quisieras hacerlo obligatorio, agrega aquí
        // Por ahora, opcional, así que no validar
        delete nuevosErrores.pais;
        break;
      case "contraseñaActual":
        if ((contraseñaActual || nuevaContraseña || confirmarNuevaContraseña) && !valor) {
          nuevosErrores.contraseñaActual = "Debes ingresar la contraseña actual para cambiarla.";
        } else {
          delete nuevosErrores.contraseñaActual;
        }
        break;
      case "nuevaContraseña":
        if ((contraseñaActual || nuevaContraseña || confirmarNuevaContraseña) && !valor) {
          nuevosErrores.nuevaContraseña = "Debes ingresar una nueva contraseña.";
        } else if (valor && valor.length < 8) {
          nuevosErrores.nuevaContraseña = "La nueva contraseña debe tener al menos 8 caracteres.";
        } else if (valor && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(valor)) {
          nuevosErrores.nuevaContraseña = "La nueva contraseña debe contener al menos una minúscula, una mayúscula y un número.";
        } else {
          delete nuevosErrores.nuevaContraseña;
        }
        break;
      case "confirmarNuevaContraseña":
        if ((contraseñaActual || nuevaContraseña || confirmarNuevaContraseña) && !valor) {
          nuevosErrores.confirmarNuevaContraseña = "Debes confirmar la nueva contraseña.";
        } else if (valor && nuevaContraseña !== valor) {
          nuevosErrores.confirmarNuevaContraseña = "Las contraseñas no coinciden.";
        } else {
          delete nuevosErrores.confirmarNuevaContraseña;
        }
        break;
      default:
        break;
    }

    setErrores(nuevosErrores);
  };

  // Manejador de inputs para usuario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
    validarCampo(name, value);
  };

  // Manejador para contraseñas
  const handleChangeContraseña = (setter, campo) => (e) => {
    setter(e.target.value);
    validarCampo(campo, e.target.value);
  };

  // Función de validación completa (para el submit)
  const validarFormulario = () => {
    const nuevosErrores = {};

    // Validar nombre
    if (!usuario.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(usuario.nombre.trim())) {
      nuevosErrores.nombre = "El nombre solo puede contener letras y espacios.";
    } else if (usuario.nombre.trim().length < 2) {
      nuevosErrores.nombre = "El nombre debe tener al menos 2 caracteres.";
    }

    // Validar apellido
    if (!usuario.apellido.trim()) {
      nuevosErrores.apellido = "El apellido es obligatorio.";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(usuario.apellido.trim())) {
      nuevosErrores.apellido = "El apellido solo puede contener letras y espacios.";
    } else if (usuario.apellido.trim().length < 2) {
      nuevosErrores.apellido = "El apellido debe tener al menos 2 caracteres.";
    }

    // Validar teléfono
    if (usuario.telefono && !/^\d{7,15}$/.test(usuario.telefono.toString().trim())) {
      nuevosErrores.telefono = "El teléfono debe contener solo números y tener entre 7 y 15 dígitos.";
    }

    // Validar país: opcional, no validar caracteres ya que es select
    // Si quieres hacerlo obligatorio, agrega: if (!usuario.pais) nuevosErrores.pais = "El país es obligatorio.";

    // Validar contraseñas
    if (contraseñaActual || nuevaContraseña || confirmarNuevaContraseña) {
      if (!contraseñaActual) {
        nuevosErrores.contraseñaActual = "Debes ingresar la contraseña actual para cambiarla.";
      }
      if (!nuevaContraseña) {
        nuevosErrores.nuevaContraseña = "Debes ingresar una nueva contraseña.";
      } else if (nuevaContraseña.length < 8) {
        nuevosErrores.nuevaContraseña = "La nueva contraseña debe tener al menos 8 caracteres.";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(nuevaContraseña)) {
        nuevosErrores.nuevaContraseña = "La nueva contraseña debe contener al menos una minúscula, una mayúscula y un número.";
      }
      if (!confirmarNuevaContraseña) {
        nuevosErrores.confirmarNuevaContraseña = "Debes confirmar la nueva contraseña.";
      } else if (nuevaContraseña !== confirmarNuevaContraseña) {
        nuevosErrores.confirmarNuevaContraseña = "Las contraseñas no coinciden.";
      }
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // GUARDAR CAMBIOS
  const handleGuardar = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (!validarFormulario()) {
      setMensaje("❌ Corrige los errores antes de guardar.");
      return;
    }

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

      // En lugar de setMensaje, mostrar modal de éxito
      setModalExito(true);
      setTimeout(() => setModalExito(false), 2500); // Cerrar automáticamente después de 2.5 segundos

      setContraseñaActual("");
      setNuevaContraseña("");
      setConfirmarNuevaContraseña("");

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

  // Función para determinar si el mensaje es de error
  const esMensajeError = (msg) => msg.startsWith("❌");

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
                {errores.nombre && <p style={{ color: 'red' }}>{errores.nombre}</p>}

                <label htmlFor="apellido">Apellido:</label>
                <input
                  id="apellido"
                  type="text"
                  name="apellido"
                  value={usuario.apellido}
                  onChange={handleChange}
                  required
                />
                {errores.apellido && <p style={{ color: 'red' }}>{errores.apellido}</p>}

                <label htmlFor="telefono">Teléfono:</label>
                <input
                  id="telefono"
                  type="text"
                  name="telefono"
                  value={usuario.telefono}
                  onChange={handleChange}
                />
                {errores.telefono && <p style={{ color: 'red' }}>{errores.telefono}</p>}

                <label htmlFor="pais">País:</label>
                <select
                  id="pais"
                  name="pais"
                  value={usuario.pais}
                  onChange={handleChange}
                >
                  <option value="Colombia">Colombia</option>
                  <option value="México">México</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Chile">Chile</option>
                  <option value="Ecuador">Ecuador</option>
                </select>
                {errores.pais && <p style={{ color: 'red' }}>{errores.pais}</p>}

                <h4>Cambiar Contraseña</h4>

                <label htmlFor="passActual">Contraseña actual:</label>
                <input
                  id="passActual"
                  type="password"
                  value={contraseñaActual}
                  onChange={handleChangeContraseña(setContraseñaActual, "contraseñaActual")}
                />
                {errores.contraseñaActual && <p style={{ color: 'red' }}>{errores.contraseñaActual}</p>}

                <label htmlFor="passNueva">Nueva contraseña:</label>
                <input
                  id="passNueva"
                  type="password"
                  value={nuevaContraseña}
                  onChange={handleChangeContraseña(setNuevaContraseña, "nuevaContraseña")}
                />
                {errores.nuevaContraseña && <p style={{ color: 'red' }}>{errores.nuevaContraseña}</p>}

                <label htmlFor="confirmarPassNueva">Confirmar nueva contraseña:</label>
                <input
                  id="confirmarPassNueva"
                  type="password"
                  value={confirmarNuevaContraseña}
                  onChange={handleChangeContraseña(setConfirmarNuevaContraseña, "confirmarNuevaContraseña")}
                />
                {errores.confirmarNuevaContraseña && <p style={{ color: 'red' }}>{errores.confirmarNuevaContraseña}</p>}

                <button type="submit" className="btn-guardar">
                  Guardar cambios
                </button>
              </form>

              {mensaje && (
                <p 
                  className="mensaje" 
                  style={{ color: esMensajeError(mensaje) ? 'red' : 'green' }}
                >
                  {mensaje}
                </p>
              )}
            </div>

            {/* DIRECCIÓN DE ENVÍO */}
            <DireccionEnvio
              usuario={usuario}
              onActualizar={obtenerDatosPerfil}
            />
          </div>
        </div>

      </div>

      {/* Modal éxito */}
      {modalExito && (
        <div className="modal-overlay" role="presentation">
          <div className="modal-contenido" role="presentation">
            <h3 style={{ color: "green" }}>✔ Perfil actualizado con éxito</h3>
            <p>Los cambios han sido guardados correctamente.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CuentaCliente;
