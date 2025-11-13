// src/components/ForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      // Enviar correo al backend
      const res = await axios.post("http://localhost:3000/api/usuarios/recuperar", {
        email,
      });

      if (res.data.success) {
        // Guardamos el correo temporalmente en localStorage para la siguiente vista
        localStorage.setItem("emailRecuperacion", email);

        setMensaje("✅ Se envió un código de verificación a tu correo (simulado)");
        console.log("Código generado (para pruebas):", res.data.codigo); // Muestra el código en consola

        // Redirige tras unos segundos a la verificación
        setTimeout(() => navigate("/verificar-codigo"), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "❌ Error al procesar la solicitud");
    }
  };

  return (
    <div className="forgot-container" style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Recuperar Contraseña</h2>
      <p>Ingresa tu correo electrónico para recibir un código de recuperación.</p>

      <form onSubmit={handleSubmit}>
        <label>Correo electrónico:</label>
        <input
          type="email"
          className="form-control mb-3"
          placeholder="tu@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" className="btn btn-primary w-100">
          Enviar código
        </button>
      </form>

      {mensaje && <div className="alert alert-success mt-3">{mensaje}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
};

export default ForgotPassword;
