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

  const handleChange = (e) => {
    setHasEdited(true);
    setDireccionData({ ...direccionData, [e.target.name]: e.target.value });
  };

  const handleGuardarDireccion = async (e) => {
    e.preventDefault();
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

      setMensaje("✅ Dirección actualizada con éxito");
      setMostrarFormulario(false);
      setHasEdited(false);

      if (onActualizar) onActualizar();
    } catch (error) {
      console.error("Error al guardar dirección:", error);
      setMensaje(`❌ ${error.message}`);
    }
  };

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

          <label htmlFor="direccion">Dirección:</label>
          <input
            id="direccion"
            type="text"
            name="direccion"
            value={direccionData.direccion}
            onChange={handleChange}
            required
          />

          <label htmlFor="codigo_postal">Código postal:</label>
          <input
            id="codigo_postal"
            type="text"
            name="codigo_postal"
            value={direccionData.codigo_postal}
            onChange={handleChange}
          />

          <label htmlFor="ciudad">Ciudad:</label>
          <input
            id="ciudad"
            type="text"
            name="ciudad"
            value={direccionData.ciudad}
            onChange={handleChange}
            required
          />

          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "10px" }}>
            <button type="submit" className="btn-guardar-direccion">
              Guardar dirección
            </button>
          </div>
        </form>
      )}

      {mensaje && <p className="mensaje">{mensaje}</p>}
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
