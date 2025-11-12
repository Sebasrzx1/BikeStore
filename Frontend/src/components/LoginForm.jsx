import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [mostrarContraseña, setMostrarContraseña] = useState(false);

  const navigate = useNavigate();
  const { login, redirectPath, setRedirectPath } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("Verificando...");

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contraseña }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // ✅ Guardar token y usuario en localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("rol", data.usuario.rol);
        localStorage.setItem("nombre", data.usuario.nombre);

        // ✅ Llamar al login del contexto pasando usuario y token
        login(data.usuario, data.token);

        setMensaje("✅ Inicio de sesión exitoso");

        // ✅ Redirigir al destino o a la cuenta
        const destino = redirectPath || "/cuenta";
        navigate(destino);
        setRedirectPath("/");
      } else {
        setMensaje(`❌ ${data.message || "Error al iniciar sesión"}`);
      }
    } catch (error) {
      console.error("Error en login:", error);
      setMensaje("❌ No se pudo conectar con el servidor");
    }
  };

  return (
    <div className="LoginSection">
      <div className="contenedorlogin">
        <div className="EncabezadoLogin">
          <img src="/Logo.png" alt="BikeStore" className="loginLogo" />
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
            <div className="ContCampo">
              <img src="../public/IconEmail.svg" alt="" />
              <input
                className="LoginInput"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="LoginCampo">
            <label>Contraseña</label>
            <div className="ContCampo">
              <img src="../public/Icon Lock.svg" alt="" />
              <input
                className="LoginInput"
                type={mostrarContraseña ? "text" : "password"}
                placeholder="*****"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                required
              />
              <img
                src={
                  mostrarContraseña
                    ? "../public/IconEyeoff.svg"
                    : "../public/IconEye.svg"
                }
                alt="Mostrar contraseña"
                className="icono-ojo"
                onClick={() => setMostrarContraseña(!mostrarContraseña)}
              />
            </div>
          </div>

          <div className="LoginOlvidar">¿Olvidaste tu contraseña?</div>

          <button className="auth-button" type="submit">
            Iniciar sesión
          </button>
        </form>

        <div className="volver-inicio">
          <Link to="/" className="volver-btn">
            ← Volver al inicio
          </Link>
        </div>

        {mensaje && <p className="auth-message">{mensaje}</p>}
      </div>
    </div>
  );
}
