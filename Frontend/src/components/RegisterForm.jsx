import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

export default function RegisterForm({ setIsRegistering }) {
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState({});
  const [aceptaDatos, setAceptaDatos] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    contraseña: "",
    confirmarContraseña: "",
    pais: "Colombia",
  });

  const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/;
  const soloNumeros = /^[0-9]*$/;

  const validarCampo = (nombreCampo, valor) => {
    let error = "";

    switch (nombreCampo) {
      case "nombre":
      case "apellido":
        if (!soloLetras.test(valor)) {
          error = "Solo se permiten letras.";
        } else if (valor.length > 30) {
          error = "Máximo 30 caracteres.";
        }
        break;

      case "telefono":
        if (!soloNumeros.test(valor)) {
          error = "Solo se permiten números.";
        } else if (valor.length > 15) {
          error = "Máximo 15 dígitos.";
        }
        break;

      case "email":
        if (!/\S+@\S+\.\S+/.test(valor)) {
          error = "Correo electrónico no válido.";
        }
        break;

      case "contraseña":
        if (valor.length < 6) {
          error = "Debe tener al menos 6 caracteres.";
        }
        break;

      case "confirmarContraseña":
        if (valor !== formData.contraseña) {
          error = "Las contraseñas no coinciden.";
        }
        break;

      default:
        break;
    }

    setErrores((prev) => ({ ...prev, [nombreCampo]: error }));
  };

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validarCampo(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    Object.keys(formData).forEach((campo) =>
      validarCampo(campo, formData[campo])
    );
    const hayErrores = Object.values(errores).some((msg) => msg);
    if (hayErrores) {
      setMensaje("❌ Corrige los errores antes de continuar.");
      return;
    }

    if (!aceptaDatos) {
      setMensaje("⚠️ Debes aceptar el tratamiento de tus datos personales.");
      return;
    }

    const payload = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      telefono: formData.telefono,
      email: formData.email,
      contraseña: formData.contraseña,
      pais: formData.pais,
    };

    try {
      const response = await fetch("http://localhost:3000/api/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMensaje(` ${data.message || "Registro exitoso"}`);
        setFormData({
          nombre: "",
          apellido: "",
          telefono: "",
          email: "",
          contraseña: "",
          confirmarContraseña: "",
          pais: "Colombia",
        });
        setErrores({});
        setAceptaDatos(false);
      } else {
        setMensaje(` ${data.message || "Error al registrarse"}`);
      }
    } catch (error) {
      console.error(error);
      setMensaje(" No se pudo conectar con el servidor");
    }
  };

  return (
    <div className="RegisterSection">
      <div className="contenedorRegister">
        <div className="EncabezadoRegister">
          <img src="/Logo.png" alt="BikeStore" />
          <h2 className="TituloRegister">¡Bienvenido a BikeStore!</h2>
          <p className="ParrafoRegister">
            Regístrate para comenzar tu aventura ciclista
          </p>
        </div>

        <div className="BotonesLogin">
          <div className="botonIZQ" onClick={() => navigate("/login")}>
            Iniciar sesión
          </div>
          <div className="botonDER" onClick={() => navigate("/register")}>
            Registrarse
          </div>
        </div>

        <form className="CardRegister" onSubmit={handleSubmit}>
          {/* Nombre y Apellido */}
          <div className="nombre-apellido-row">
            <div className="contenedor-input-nombre">
              <label>Nombre</label>
              <input
                className={`RegisterInput ${
                  errores.nombre ? "input-error" : ""
                }`}
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
              {errores.nombre && <p className="error-text">{errores.nombre}</p>}
            </div>

            <div className="contenedor-input-apellido">
              <label>Apellido</label>
              <input
                className={`RegisterInput ${
                  errores.apellido ? "input-error" : ""
                }`}
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
              />
              {errores.apellido && (
                <p className="error-text">{errores.apellido}</p>
              )}
            </div>
          </div>

          {/* Campos normales */}
          <div className="auth-field">
            <label>Correo electrónico</label>
            <input
              className={`InputNormal ${errores.email ? "input-error" : ""}`}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errores.email && <p className="error-text">{errores.email}</p>}
          </div>

          <div className="auth-field">
            <label>Teléfono</label>
            <input
              className={`InputNormal ${errores.telefono ? "input-error" : ""}`}
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
            />
            {errores.telefono && (
              <p className="error-text">{errores.telefono}</p>
            )}
          </div>

          <div className="auth-field">
            <label>País</label>
            <select
              className="InputNormal"
              name="pais"
              value={formData.pais}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un país</option>
              <option value="Colombia">Colombia</option>
              <option value="México">México</option>
              <option value="Argentina">Argentina</option>
              <option value="Chile">Chile</option>
              <option value="España">España</option>
            </select>
          </div>

          <div className="auth-field">
            <label>Contraseña</label>
            <input
              className={`InputNormal ${
                errores.contraseña ? "input-error" : ""
              }`}
              type="password"
              name="contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              required
            />
            {errores.contraseña && (
              <p className="error-text">{errores.contraseña}</p>
            )}
          </div>

          <div className="auth-field">
            <label>Confirmar contraseña</label>
            <input
              className={`InputNormal ${
                errores.confirmarContraseña ? "input-error" : ""
              }`}
              type="password"
              name="confirmarContraseña"
              value={formData.confirmarContraseña}
              onChange={handleChange}
              required
            />
            {errores.confirmarContraseña && (
              <p className="error-text">{errores.confirmarContraseña}</p>
            )}
          </div>

          <div className="checkbox-datos">
            <input
              type="checkbox"
              id="aceptaDatos"
              checked={aceptaDatos}
              onChange={(e) => setAceptaDatos(e.target.checked)}
            />
            <label htmlFor="aceptaDatos">
              Acepto el{" "}
              <span
                className="link-datos"
                onClick={() => setMostrarModal(true)}
              >
                tratamiento de mis datos personales
              </span>
              .
            </label>
          </div>

          <button
            className="button-crear-cuenta"
            type="submit"
            disabled={!aceptaDatos}
          >
            Crear cuenta
          </button>
        </form>

        {mensaje && <p className="auth-message">{mensaje}</p>}
      </div>

      {mostrarModal && (
        <div className="modal-overlay" onClick={() => setMostrarModal(false)}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <h3>Tratamiento de datos personales</h3>
            <p>
              En BikeStore respetamos tu privacidad. Los datos que nos
              proporcionas serán utilizados únicamente para crear tu cuenta y
              mejorar tu experiencia dentro de la tienda. No compartiremos tu
              información con terceros sin tu consentimiento.
            </p>
            <button onClick={() => setMostrarModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
