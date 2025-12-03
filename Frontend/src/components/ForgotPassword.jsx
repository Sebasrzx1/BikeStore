import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("Enviando código...");
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:3000/api/usuarios/recuperar",
        { email }
      );

      if (res.data.success) {
        localStorage.setItem("emailRecuperacion", email);
        setMensaje(
          "✅ Se envió un código de verificación a tu correo (simulado)"
        );
        console.log("Código generado (para pruebas):", res.data.codigo);

        setTimeout(() => navigate("/verificar-codigo"), 2000);
      } else {
        setError(res.data.message || "❌ No se pudo enviar el código");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "❌ Error al procesar la solicitud"
      );
    }
  };

  return (
    <div className="LoginSection">
      <div className="contenedorlogin">
        <div className="EncabezadoLogin">
          <img src="/Logo.png" alt="BikeStore" className="loginLogo" />
          <h2 className="TituloLogin">Recuperar Contraseña</h2>
          <p className="ParrafoLogin">
            Ingresa tu correo electrónico para recibir un código de recuperación.
          </p>
        </div>

        <form
          className="CardLogin"
          onSubmit={handleSubmit}
          style={{ transition: "all 0.3s ease" }}
        >
          <div className="LoginCampo">
            <label htmlFor="emailInput">Correo electrónico</label>
            <div className="ContCampo">
              <img src="../public/IconEmail.svg" alt="" />
              <input
                id="emailInput"
                className="LoginInput"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button className="auth-button" type="submit">
            Enviar código
          </button>
        </form>

        <div className="volver-inicio">
          <Link to="/login" className="volver-btn">
            ← Volver al inicio de sesión
          </Link>
        </div>

        {mensaje && (
          <p
            className="auth-message"
            style={{ color: "#007600", marginTop: "10px", textAlign: "center" }}
          >
            {mensaje}
          </p>
        )}
        {error && (
          <p
            className="auth-message"
            style={{ color: "red", marginTop: "10px", textAlign: "center" }}
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
