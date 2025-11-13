// src/components/VerifyCode.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyCode = () => {
  const [codigo, setCodigo] = useState("");
  const [nuevaContraseña, setNuevaContraseña] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [verificado, setVerificado] = useState(false);

  const navigate = useNavigate();
  const email = localStorage.getItem("emailRecuperacion");

  const handleVerificarCodigo = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    try {
      const res = await axios.post("http://localhost:3000/api/usuarios/verificar-codigo", {
        email,
        codigo,
      });

      if (res.data.success) {
        setVerificado(true);
        setMensaje("✅ Código verificado correctamente, ahora cambia tu contraseña.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "❌ Error al verificar el código");
    }
  };

  const handleCambiarContraseña = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (nuevaContraseña !== confirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/usuarios/cambiar-contrasena", {
  email,
  nuevaContraseña,
});


      if (res.data.success) {
        alert("✅ Contraseña cambiada exitosamente");
        localStorage.removeItem("emailRecuperacion");
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "❌ Error al cambiar la contraseña");
    }
  };

  return (
    <div className="verify-container" style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Verificación de Código</h2>

      {!verificado ? (
        <form onSubmit={handleVerificarCodigo}>
          <label>Código recibido:</label>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Ingresa el código de 6 dígitos"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            maxLength={6}
            required
          />
          <button className="btn btn-primary w-100">Verificar código</button>
        </form>
      ) : (
        <form onSubmit={handleCambiarContraseña}>
          <label>Nueva contraseña:</label>
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Nueva contraseña"
            value={nuevaContraseña}
            onChange={(e) => setNuevaContraseña(e.target.value)}
            required
          />

          <label>Confirmar contraseña:</label>
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Confirma tu contraseña"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            required
          />

          <button className="btn btn-success w-100">Cambiar contraseña</button>
        </form>
      )}

      {mensaje && <div className="alert alert-success mt-3">{mensaje}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
};

export default VerifyCode;
