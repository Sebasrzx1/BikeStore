import React, { useState, useEffect } from "react";
import '../styles/DireccionEnvio.css'


const DireccionEnvio = ({ usuario, onActualizar }) => {
  const [direccionData, setDireccionData] = useState({
    departamento: "",
    direccion: "",
    codigo_postal: "",
    ciudad: "",
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // ✅ Cargar datos actuales del usuario (si existen)
  useEffect(() => {
    if (usuario) {
      setDireccionData({
        departamento: usuario.departamento || "",
        direccion: usuario.direccion || "",
        codigo_postal: usuario.codigo_postal || "",
        ciudad: usuario.ciudad || "",
      });
    }
  }, [usuario]);

  // Manejador de cambios
  const handleChange = (e) => {
    setDireccionData({ ...direccionData, [e.target.name]: e.target.value });
  };

  // Guardar dirección
  const handleGuardarDireccion = async (e) => {
    e.preventDefault();
    setMensaje("Guardando dirección...");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No autenticado");

      // Enviar SOLO los campos de dirección
      const payload = {};
      if (
        direccionData.departamento &&
        direccionData.departamento.trim() !== ""
      )
        payload.departamento = direccionData.departamento.trim();
      if (direccionData.direccion && direccionData.direccion.trim() !== "")
        payload.direccion = direccionData.direccion.trim();
      if (
        direccionData.codigo_postal &&
        direccionData.codigo_postal.toString().trim() !== ""
      )
        payload.codigo_postal = direccionData.codigo_postal.toString().trim();
      if (direccionData.ciudad && direccionData.ciudad.trim() !== "")
        payload.ciudad = direccionData.ciudad.trim();

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
      if (!res.ok)
        throw new Error(data.message || "Error al guardar dirección");

      setMensaje("✅ Dirección actualizada con éxito");
      setMostrarFormulario(false);

      if (onActualizar) onActualizar(); // refresca datos del usuario
    } catch (error) {
      console.error("Error al guardar dirección:", error);
      setMensaje(`❌ ${error.message}`);
    }
  };

  return (
    <div className="direccion-envio">
      <div className="ContTIT">
      <img src="../public/Iconubi.svg" alt="" />
      <h3> Dirección de Envío</h3>
      </div>
      {!mostrarFormulario ? (
        <>
          {direccionData.direccion ? (
            <div className="direccion-info">
              <p>
                <strong>Dirección:</strong> {direccionData.direccion}
              </p>
              <p>
                <strong>Ciudad:</strong> {direccionData.ciudad}
              </p>
              <p>
                <strong>Departamento:</strong> {direccionData.departamento}
              </p>
              <p>
                <strong>Código postal:</strong> {direccionData.codigo_postal}
              </p>
              <button
                className="btn-editar-direccion"
                onClick={() => setMostrarFormulario(true)}
              >
                 Editar dirección
              </button>
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
        <form onSubmit={handleGuardarDireccion} className="direccion-form">
          <label>Departamento:</label>
          <input
            type="text"
            name="departamento"
            value={direccionData.departamento}
            onChange={handleChange}
            required
          />

          <label>Dirección:</label>
          <input
            type="text"
            name="direccion"
            value={direccionData.direccion}
            onChange={handleChange}
            required
          />

          <label>Código postal:</label>
          <input
            type="text"
            name="codigo_postal"
            value={direccionData.codigo_postal}
            onChange={handleChange}
          />

          <label>Ciudad:</label>
          <input
            type="text"
            name="ciudad"
            value={direccionData.ciudad}
            onChange={handleChange}
            required
          />

          <div style={{ marginTop: "1rem", justifyContent: "space-between", display:"flex" , gap:"10px"}}>
            <button type="submit" className="btn-guardar-direccion">
              Guardar dirección
            </button>
            <button
              type="button"
              onClick={() => setMostrarFormulario(false)}
              className="btn-cancelar"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  );
};

export default DireccionEnvio;