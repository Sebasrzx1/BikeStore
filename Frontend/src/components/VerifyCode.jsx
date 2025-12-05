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
  const [errores, setErrores] = useState({}); // Estado para errores de validación
  const [modalExito, setModalExito] = useState(false); // Estado para modal de éxito

  const navigate = useNavigate();
  const email = localStorage.getItem("emailRecuperacion");

  // Función para validar un campo específico
  const validarCampo = (campo, valor) => {
    const nuevosErrores = { ...errores };

    switch (campo) {
      case "codigo":
        if (!valor.trim()) {
          nuevosErrores.codigo = "El código es obligatorio.";
        } else if (!/^\d{6}$/.test(valor.trim())) {
          nuevosErrores.codigo = "El código debe contener exactamente 6 dígitos numéricos.";
        } else {
          delete nuevosErrores.codigo;
        }
        break;
      case "nuevaContraseña":
        if (!valor) {
          nuevosErrores.nuevaContraseña = "La nueva contraseña es obligatoria.";
        } else if (valor.length < 6) {
          nuevosErrores.nuevaContraseña = "La nueva contraseña debe tener al menos 6 caracteres.";
        } else {
          delete nuevosErrores.nuevaContraseña;
        }
        break;
      case "confirmar":
        if (!valor) {
          nuevosErrores.confirmar = "Debes confirmar la nueva contraseña.";
        } else if (valor !== nuevaContraseña) {
          nuevosErrores.confirmar = "Las contraseñas no coinciden.";
        } else {
          delete nuevosErrores.confirmar;
        }
        break;
      default:
        break;
    }

    setErrores(nuevosErrores);
  };

  // Manejador para código
  const handleChangeCodigo = (e) => {
    const value = e.target.value;
    setCodigo(value);
    validarCampo("codigo", value);
  };

  // Manejador para nueva contraseña
  const handleChangeNuevaContraseña = (e) => {
    const value = e.target.value;
    setNuevaContraseña(value);
    validarCampo("nuevaContraseña", value);
    // Revalidar confirmar si ya tiene valor
    if (confirmar) validarCampo("confirmar", confirmar);
  };

  // Manejador para confirmar contraseña
  const handleChangeConfirmar = (e) => {
    const value = e.target.value;
    setConfirmar(value);
    validarCampo("confirmar", value);
  };

  // Función de validación completa para verificar código
  const validarFormularioVerificar = () => {
    const nuevosErrores = {};
    if (!codigo.trim()) {
      nuevosErrores.codigo = "El código es obligatorio.";
    } else if (!/^\d{6}$/.test(codigo.trim())) {
      nuevosErrores.codigo = "El código debe contener exactamente 6 dígitos numéricos.";
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Función de validación completa para cambiar contraseña
  const validarFormularioCambiar = () => {
    const nuevosErrores = {};
    if (!nuevaContraseña) {
      nuevosErrores.nuevaContraseña = "La nueva contraseña es obligatoria.";
    } else if (nuevaContraseña.length < 6) {
      nuevosErrores.nuevaContraseña = "La nueva contraseña debe tener al menos 6 caracteres.";
    }
    if (!confirmar) {
      nuevosErrores.confirmar = "Debes confirmar la nueva contraseña.";
    } else if (confirmar !== nuevaContraseña) {
      nuevosErrores.confirmar = "Las contraseñas no coinciden.";
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleVerificarCodigo = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!validarFormularioVerificar()) {
      setError("❌ Corrige los errores antes de verificar.");
      return;
    }

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

    if (!validarFormularioCambiar()) {
      setError("❌ Corrige los errores antes de cambiar.");
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
        // En lugar de alert, mostrar modal de éxito
        setModalExito(true);
        setTimeout(() => {
          localStorage.removeItem("emailRecuperacion");
          navigate("/login");
        }, 2500); // Cerrar modal y redirigir después de 2.5 segundos
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
              {/* 1️⃣ Label asociado correctamente */}
              <label htmlFor="codigo">Código de verificación</label>
              <div className="ContCampo">
                <img src="../public/Icon Lock.svg" alt="" />
                <input
                  id="codigo"
                  className="LoginInput"
                  type="text"
                  placeholder="Ingresa el código de 6 dígitos"
                  value={codigo}
                  onChange={handleChangeCodigo}
                  maxLength={6}
                  required
                />
              </div>
              {errores.codigo && <p style={{ color: 'red' }}>{errores.codigo}</p>}
              <button className="auth-button" type="submit">
                Verificar código
              </button>
            </div>
          ) : (
            <>
              <div className="LoginCampo">
                {/* 2️⃣ Label asociado correctamente */}
                <label htmlFor="nueva-contrasena">Nueva contraseña</label>
                <div className="ContCampo">
                  <img src="../public/Icon Lock.svg" alt="" />
                  <input
                    id="nueva-contrasena"
                    className="LoginInput"
                    type="password"
                    placeholder="Nueva contraseña"
                    value={nuevaContraseña}
                    onChange={handleChangeNuevaContraseña}
                    required
                  />
                </div>
                {errores.nuevaContraseña && <p style={{ color: 'red' }}>{errores.nuevaContraseña}</p>}
              </div>

              <div className="LoginCampo">
                {/* 3️⃣ Label asociado correctamente */}
                <label htmlFor="confirmar-contrasena">Confirmar contraseña</label>
                <div className="ContCampo">
                  <img src="../public/Icon Lock.svg" alt="" />
                  <input
                    id="confirmar-contrasena"
                    className="LoginInput"
                    type="password"
                    placeholder="Confirma tu contraseña"
                    value={confirmar}
                    onChange={handleChangeConfirmar}
                    required
                  />
                </div>
                {errores.confirmar && <p style={{ color: 'red' }}>{errores.confirmar}</p>}
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

        {/* Modal éxito */}
        {modalExito && (
          <div className="modal-overlay" role="presentation">
            <div className="modal-contenido" role="presentation">
              <h3 style={{ color: "green" }}>✔ Contraseña cambiada exitosamente</h3>
              <p>Serás redirigido al inicio de sesión...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
