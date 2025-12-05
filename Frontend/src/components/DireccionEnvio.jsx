import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../styles/DireccionEnvio.css";

const DireccionEnvio = ({ usuario, onActualizar }) => {
  const [direccionData, setDireccionData] = useState({
    departamento: "",
    direccion: "",
    codigo_postal: "",
    ciudad: "",
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [hasEdited, setHasEdited] = useState(false);
  const [errores, setErrores] = useState({}); // Estado para errores de validación
  const [modalExito, setModalExito] = useState(false); // Estado para modal de éxito

  // Cargar datos iniciales
  useEffect(() => {
    if (usuario && !hasEdited) {
      setDireccionData({
        departamento: usuario.departamento || "",
        direccion: usuario.direccion || "",
        codigo_postal: usuario.codigo_postal || "",
        ciudad: usuario.ciudad || "",
      });
    }
  }, [usuario, hasEdited]);

  // Función para validar un campo específico
  const validarCampo = (campo, valor) => {
    const nuevosErrores = { ...errores };

    switch (campo) {
      case "departamento":
        if (!valor.trim()) {
          nuevosErrores.departamento = "Departamento es obligatorio.";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(valor.trim())) {
          nuevosErrores.departamento = "Departamento solo puede contener letras y espacios.";
        } else if (valor.trim().length < 2 && valor.trim()) {
          nuevosErrores.departamento = "Departamento debe tener al menos 2 caracteres.";
        } else {
          delete nuevosErrores.departamento;
        }
        break;
      case "direccion":
        if (!valor.trim()) {
          nuevosErrores.direccion = "La dirección es obligatoria.";
        } else if (valor.trim().length < 5) {
          nuevosErrores.direccion = "La dirección debe tener al menos 5 caracteres.";
        } else {
          delete nuevosErrores.direccion;
        }
        break;
      case "codigo_postal":
        if (valor && !/^\d*$/.test(valor.toString().trim())) {
          nuevosErrores.codigo_postal = "El código postal debe contener solo números.";
        } else if (valor && valor.toString().trim().length > 10) {
          nuevosErrores.codigo_postal = "El código postal no puede tener más de 10 dígitos.";
        } else if (valor && valor.toString().trim().length < 5 && valor.toString().trim()) {
          nuevosErrores.codigo_postal = "El código postal debe tener al menos 5 dígitos.";
        } else {
          delete nuevosErrores.codigo_postal;
        }
        break;
      case "ciudad":
        if (!valor.trim()) {
          nuevosErrores.ciudad = "La ciudad es obligatoria.";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(valor.trim())) {
          nuevosErrores.ciudad = "La ciudad solo puede contener letras y espacios.";
        } else if (valor.trim().length < 2 && valor.trim()) {
          nuevosErrores.ciudad = "La ciudad debe tener al menos 2 caracteres.";
        } else {
          delete nuevosErrores.ciudad;
        }
        break;
      default:
        break;
    }

    setErrores(nuevosErrores);
  };

  const handleChange = (e) => {
    setHasEdited(true);
    const { name, value } = e.target;
    setDireccionData({ ...direccionData, [name]: value });
    validarCampo(name, value);
  };

  // Función de validación completa (para el submit)
  const validarFormulario = () => {
    const nuevosErrores = {};

    // Validar departamento
    if (!direccionData.departamento.trim()) {
      nuevosErrores.departamento = "El departamento es obligatorio.";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(direccionData.departamento.trim())) {
      nuevosErrores.departamento = "El departamento solo puede contener letras y espacios.";
    } else if (direccionData.departamento.trim().length < 2) {
      nuevosErrores.departamento = "El departamento debe tener al menos 2 caracteres.";
    }

    // Validar dirección
    if (!direccionData.direccion.trim()) {
      nuevosErrores.direccion = "La dirección es obligatoria.";
    } else if (direccionData.direccion.trim().length < 5) {
      nuevosErrores.direccion = "La dirección debe tener al menos 5 caracteres.";
    }

    // Validar código postal
    if (direccionData.codigo_postal && !/^\d{5,10}$/.test(direccionData.codigo_postal.toString().trim())) {
      nuevosErrores.codigo_postal = "El código postal debe contener solo números y tener entre 5 y 10 dígitos.";
    }

    // Validar ciudad
    if (!direccionData.ciudad.trim()) {
      nuevosErrores.ciudad = "La ciudad es obligatoria.";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(direccionData.ciudad.trim())) {
      nuevosErrores.ciudad = "La ciudad solo puede contener letras y espacios.";
    } else if (direccionData.ciudad.trim().length < 2) {
      nuevosErrores.ciudad = "La ciudad debe tener al menos 2 caracteres.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleGuardarDireccion = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (!validarFormulario()) {
      setMensaje("❌ Corrige los errores antes de guardar.");
      return;
    }

    setMensaje("Guardando dirección...");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No autenticado");

      const payload = {};
      if (direccionData.departamento.trim()) payload.departamento = direccionData.departamento.trim();
      if (direccionData.direccion.trim()) payload.direccion = direccionData.direccion.trim();
      if (direccionData.codigo_postal.toString().trim()) payload.codigo_postal = direccionData.codigo_postal.toString().trim();
      if (direccionData.ciudad.trim()) payload.ciudad = direccionData.ciudad.trim();

      if (Object.keys(payload).length === 0) {
        setMensaje("⚠️ No hay cambios para guardar.");
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
      if (!res.ok) throw new Error(data.message || "Error al guardar dirección");

      // En lugar de setMensaje, mostrar modal de éxito
      setModalExito(true);
      setTimeout(() => setModalExito(false), 2500); // Cerrar automáticamente después de 2.5 segundos

      setMostrarFormulario(false);
      setHasEdited(false);

      if (onActualizar) onActualizar();
    } catch (error) {
      console.error("Error al guardar dirección:", error);
      setMensaje(`❌ ${error.message}`);
    }
  };

  // Función para determinar si el mensaje es de error
  const esMensajeError = (msg) => msg.startsWith("❌");

  return (
    <div className="direccion-envio">
      <div className="ContTIT">
        <img src="../public/Iconubi.svg" alt="Icono ubicación" />
        <h3>Dirección de Envío</h3>
      </div>

      {!mostrarFormulario ? (
        <>
          {direccionData.direccion ? (
            <div className="direccion-info">
              <p><strong>Dirección:</strong> {direccionData.direccion}</p>
              <p><strong>Ciudad:</strong> {direccionData.ciudad}</p>
              <p><strong>Departamento:</strong> {direccionData.departamento}</p>
              <p><strong>Código postal:</strong> {direccionData.codigo_postal}</p>
            </div>
          ) : (
            <div className="contenedor-sin-registro">
              <p>No tienes una dirección registrada.</p>
              <button
                className="btn-agregar-direccion"
                onClick={() => setMostrarFormulario(true)}
              >
                Agregar dirección
              </button>
            </div>
          )}
        </>
      ) : (
        <form onSubmit={handleGuardarDireccion} className="direccion-form" noValidate>
          <label htmlFor="departamento">Departamento:</label>
          <input
            id="departamento"
            type="text"
            name="departamento"
            value={direccionData.departamento}
            onChange={handleChange}
            required
          />
          {errores.departamento && <p style={{ color: 'red' }}>{errores.departamento}</p>}

          <label htmlFor="direccion">Dirección:</label>
          <input
            id="direccion"
            type="text"
            name="direccion"
            value={direccionData.direccion}
            onChange={handleChange}
            required
          />
          {errores.direccion && <p style={{ color: 'red' }}>{errores.direccion}</p>}

          <label htmlFor="codigo_postal">Código postal:</label>
          <input
            id="codigo_postal"
            type="text"
            name="codigo_postal"
            value={direccionData.codigo_postal}
            onChange={handleChange}
          />
          {errores.codigo_postal && <p style={{ color: 'red' }}>{errores.codigo_postal}</p>}

          <label htmlFor="ciudad">Ciudad:</label>
          <input
            id="ciudad"
            type="text"
            name="ciudad"
            value={direccionData.ciudad}
            onChange={handleChange}
            required
          />
          {errores.ciudad && <p style={{ color: 'red' }}>{errores.ciudad}</p>}

          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "10px" }}>
            <button type="submit" className="btn-guardar-direccion">
              Guardar dirección
            </button>
          </div>
        </form>
      )}

      {mensaje && (
        <p 
          className="mensaje" 
          style={{ color: esMensajeError(mensaje) ? 'red' : 'green' }}
        >
          {mensaje}
        </p>
      )}

      {/* Modal éxito */}
      {modalExito && (
        <div className="modal-overlay" role="presentation">
          <div className="modal-contenido" role="presentation">
            <h3 style={{ color: "green" }}>✔ Dirección actualizada con éxito</h3>
            <p>Los cambios han sido guardados correctamente.</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ✅ Validación de PropTypes
DireccionEnvio.propTypes = {
  usuario: PropTypes.shape({
    departamento: PropTypes.string,
    direccion: PropTypes.string,
    codigo_postal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ciudad: PropTypes.string,
  }).isRequired,
  onActualizar: PropTypes.func.isRequired,
};

export default DireccionEnvio;
