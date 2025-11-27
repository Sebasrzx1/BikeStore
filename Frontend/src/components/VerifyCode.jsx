import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";

export default function VerifyCode() {
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
    setMensaje("Verificando código...");

    try {
      const res = await axios.post(
        "http://localhost:3000/api/usuarios/verificar-codigo",
        {
          email,
          codigo,
        }
      );

      if (res.data.success) {
        setVerificado(true);
        setMensaje(
          "✅ Código verificado correctamente. Ahora cambia tu contraseña."
        );
      } else {
        setError(res.data.message || "❌ Código incorrecto");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "❌ Error al verificar el código"
      );
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
      const res = await axios.post(
        "http://localhost:3000/api/usuarios/cambiar-contrasena",
        {
          email,
          nuevaContraseña,
        }
      );

      if (res.data.success) {
        alert("✅ Contraseña cambiada exitosamente");
        localStorage.removeItem("emailRecuperacion");
        navigate("/login");
      } else {
        setError(res.data.message || "❌ No se pudo cambiar la contraseña");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "❌ Error al cambiar la contraseña"
      );
    }
  };

  return (
    <div className="LoginSection">
      <div className="contenedorlogin">
        <div className="EncabezadoLogin">
          <img src="/Logo.png" alt="BikeStore" className="loginLogo" />
          <h2 className="TituloLogin">Recuperación de Contraseña</h2>
          <p className="ParrafoLogin">
            {verificado
              ? "Crea una nueva contraseña para tu cuenta."
              : "Revisa tu correo e ingresa el código de 6 dígitos."}
          </p>
        </div>

        <form
          className="CardLogin"
          onSubmit={
            verificado ? handleCambiarContraseña : handleVerificarCodigo
          }
          style={{ transition: "all 0.3s ease" }}
        >
          {!verificado ? (
            <div className="LoginCampo">
              <label>Código de verificación</label>
              <div className="ContCampo">
                <img src="../public/Icon Lock.svg" alt="" />
                <input
                  className="LoginInput"
                  type="text"
                  placeholder="Ingresa el código de 6 dígitos"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>
              <button className="auth-button" type="submit">
                Verificar código
              </button>
            </div>
          ) : (
            <>
              <div className="LoginCampo">
                <label>Nueva contraseña</label>
                <div className="ContCampo">
                  <img src="../public/Icon Lock.svg" alt="" />
                  <input
                    className="LoginInput"
                    type="password"
                    placeholder="Nueva contraseña"
                    value={nuevaContraseña}
                    onChange={(e) => setNuevaContraseña(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="LoginCampo">
                <label>Confirmar contraseña</label>
                <div className="ContCampo">
                  <img src="../public/Icon Lock.svg" alt="" />
                  <input
                    className="LoginInput"
                    type="password"
                    placeholder="Confirma tu contraseña"
                    value={confirmar}
                    onChange={(e) => setConfirmar(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button className="auth-button" type="submit">
                Cambiar contraseña
              </button>
            </>
          )}
        </form>

        <div className="volver-inicio">
          <Link to="/" className="volver-btn">
            ← Volver al inicio
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
