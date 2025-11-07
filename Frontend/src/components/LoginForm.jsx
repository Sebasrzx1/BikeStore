import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { email, contraseña };

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMensaje(`✅ ${data.message || "Inicio de sesión exitoso"}`);
        localStorage.setItem("token", data.token);
        localStorage.setItem("rol", data.usuario.rol);
        localStorage.setItem("nombre", data.usuario.nombre);
        setEmail("");
        setContraseña("");
        // Redirigir al home o dashboard si lo deseas
        navigate("/");
      } else {
        setMensaje(`❌ ${data.message || "Error al iniciar sesión"}`);
      }
    } catch (error) {
      console.error(error);
      setMensaje("❌ No se pudo conectar con el servidor");
    }
  };

  return (
    <div className="LoginSection">
      <div className="contenedorlogin">
        <div className="EncabezadoLogin">
<<<<<<< HEAD
          <img src="/Logo.png" alt="BikeStore" className="auth-logo" />
=======
          <img src="/public/logo.png" alt="BikeStore" className="loginLogo" />
>>>>>>> 4b16fc76531c3cff202a1b9950acf9874205a9c7
          <h2 className="TituloLogin">¡Bienvenido a BikeStore!</h2>
          <p className="ParrafoLogin">
            Inicia sesión para continuar tu viaje en bicicleta
          </p>
        </div>

        <div className="BotonesLogin">
          <div className="botondir" onClick={() => navigate("/login")}>
            Iniciar sesión
          </div>
          <div className="botonder" onClick={() => navigate("/register")}>
            Registrarse
          </div>
        </div>

        <form className="CardLogin" onSubmit={handleSubmit}>
          <div className="LoginCampo">

            <label>Correo electrónico</label>
            <img src="/IconEmail.svg" alt="IconoEmail" />
            <input
              className="LoginInput"
              type="email"
              placeholder="✉️ tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="LoginCampo">
            <label>Contraseña</label>
            <input
              className="LoginInput"
              type="password"
              placeholder="*****"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
          </div>

          <div className="LoginOlvidar">¿Olvidaste tu contraseña?</div>

          <button className="auth-button" type="submit">
            Iniciar sesión
          </button>
        </form>

        {mensaje && <p className="auth-message">{mensaje}</p>}
      </div>
    </div>
  );
}
