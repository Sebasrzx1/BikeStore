import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mostrarContraseña, setMostrarContraseña] = useState(false);

  // Validaciones
  const [errores, setErrores] = useState({});

  // Modal Alertas
  const [modalAlerta, setModalAlerta] = useState({
    visible: false,
    texto: "",
  });

  const navigate = useNavigate();
  const { login, redirectPath, setRedirectPath } = useAuth();

  // --- VALIDAR CAMPOS ---
  const validarCampo = (campo, valor) => {
    let error = "";

    if (!valor.trim()) {
      error = "Este campo es obligatorio.";
    } else {
      if (campo === "email") {
        if (!/\S+@\S+\.\S+/.test(valor)) {
          error = "Correo electrónico no válido.";
        }
      }
      if (campo === "contraseña") {
        if (valor.length < 6) {
          error = "Debe tener al menos 6 caracteres.";
        }
      }
    }

    setErrores((prev) => ({ ...prev, [campo]: error }));
    return error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación antes de enviar
    const errorEmail = validarCampo("email", email);
    const errorPass = validarCampo("contraseña", contraseña);

    if (errorEmail || errorPass) {
      setModalAlerta({
        visible: true,
        texto: "⚠️ Verifica los campos antes de iniciar sesión.",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contraseña }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("rol", data.usuario.rol);
        localStorage.setItem("nombre", data.usuario.nombre);

        login(data.usuario, data.token);

        const destino = redirectPath || "/cuenta";
        navigate(destino);
        setRedirectPath("/");
      } else {
        setModalAlerta({
          visible: true,
          texto: data.message || "Error al iniciar sesión",
        });
      }
    } catch (error) {
      console.error("Error en login:", error);
      setModalAlerta({
        visible: true,
        texto: "❌ No se pudo conectar con el servidor",
      });
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

        {/* Botones */}
        <div className="BotonesLogin">
          <div className="botondir" onClick={() => navigate("/login")}>
            Iniciar sesión
          </div>
          <div className="botonder" onClick={() => navigate("/register")}>
            Registrarse
          </div>
        </div>

        {/* FORM */}
        <form className="CardLogin" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="LoginCampo">
            <label>Correo electrónico</label>
            <div
              className={`ContCampo ${errores.email ? "campo-error" : email ? "campo-exito" : ""
                }`}
            >
              <img src="../public/IconEmail.svg" alt="" />
              <input
                className="LoginInput"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validarCampo("email", e.target.value);
                }}
                placeholder="tu@correo.com"
              />
            </div>

            {errores.email && <p className="error-text">{errores.email}</p>}
          </div>

          {/* Contraseña */}
          <div className="LoginCampo">
            <label>Contraseña</label>
            <div
              className={`ContCampo ${errores.contraseña ? "campo-error" : contraseña ? "campo-exito" : ""
                }`}
            >
              <img src="../public/Icon Lock.svg" alt="" />
              <input
                type={mostrarContraseña ? "text" : "password"}
                className="LoginInput"
                value={contraseña}
                onChange={(e) => {
                  setContraseña(e.target.value);
                  validarCampo("contraseña", e.target.value);
                }}
              />
              <img
                src={
                  mostrarContraseña
                    ? "../public/IconEyeoff.svg"
                    : "../public/IconEye.svg"
                }
                className="icono-ojo"
                onClick={() => setMostrarContraseña(!mostrarContraseña)}
              />
            </div>

            {errores.contraseña && (
              <p className="error-text">{errores.contraseña}</p>
            )}
          </div>

          <Link to="/forgot-password" className="LoginOlvidar">
            ¿Olvidaste tu contraseña?
          </Link>

          <button className="auth-button" type="submit">
            Iniciar sesión
          </button>
        </form>

        <div className="volver-inicio">
          <Link to="/" className="volver-btn">
            ← Volver al inicio
          </Link>
        </div>

        {/* MODAL ERROR */}
        {modalAlerta.visible && (
          <div
            className="modal-overlay"
            onClick={() => setModalAlerta({ visible: false })}
          >
            <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
              <h3 style={{ color: "red" }}>Error</h3>
              <p>{modalAlerta.texto}</p>
              <button onClick={() => setModalAlerta({ visible: false })}>
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
