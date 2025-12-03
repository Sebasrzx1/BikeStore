import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";
import Checkbox from "../components/Checkbox";

export default function RegisterForm({ setIsRegistering }) {
  const [errores, setErrores] = useState({});
  const [aceptaDatos, setAceptaDatos] = useState(false);

  const [modalAlerta, setModalAlerta] = useState({ visible: false, texto: "" });
  const [modalExito, setModalExito] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modalFormularioVacio, setModalFormularioVacio] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    contraseña: "",
    confirmarContraseña: "",
    pais: "Colombia",
  });

  const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;
  const soloNumeros = /^[0-9]+$/;

  const sanitizarEntrada = (valor, campo) => {
    let limpio = valor;

    if (campo === "nombre" || campo === "apellido") {
      limpio = valor.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g, "");
    } else if (campo === "telefono") {
      limpio = valor.replace(/[^0-9]/g, "");
    } else if (campo === "email") {
      limpio = valor.replace(/[^A-Za-z0-9@._-]/g, "");
    } else if (campo === "contraseña" || campo === "confirmarContraseña") {
      limpio = valor.replace(/[<>(){}=&"'`;~@#$%^|[\]?.,:!]/g, "");
    } else {
      limpio = valor.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g, "");
    }

    limpio = limpio.replace(/\s{2,}/g, " ");
    return limpio;
  };

  const validarCampo = (campo, valor) => {
    let error = "";

    if (!valor || valor.trim() === "") {
      error = "Este campo es obligatorio.";
    } else {
      switch (campo) {
        case "nombre":
        case "apellido":
          if (!soloLetras.test(valor)) error = "Solo se permiten letras y espacios.";
          else if (valor.length > 15) error = "Máximo 15 caracteres.";
          break;

        case "telefono":
          if (!soloNumeros.test(valor)) error = "Solo se permiten números.";
          else if (valor.length > 15) error = "Máximo 15 dígitos.";
          break;

        case "email":
          if (!/\S+@\S+\.\S+/.test(valor)) error = "Correo no válido.";
          break;

        case "contraseña":
          if (valor.length < 6)
            error = "La contraseña debe tener mínimo 6 caracteres.";
          break;

        case "confirmarContraseña":
          if (valor !== formData.contraseña)
            error = "Las contraseñas no coinciden.";
          break;

        default:
          break;
      }
    }

    setErrores((prev) => ({ ...prev, [campo]: error }));
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const limpio = sanitizarEntrada(value, name);

    setFormData((prev) => ({ ...prev, [name]: limpio }));
    validarCampo(name, limpio);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formVacio = Object.values(formData).every(
      (v) => v === "" || v === "Colombia"
    );

    if (formVacio && !aceptaDatos) {
      setModalFormularioVacio(true);
      return;
    }

    let hayError = false;
    Object.keys(formData).forEach((campo) => {
      if (validarCampo(campo, formData[campo])) hayError = true;
    });

    if (hayError) {
      setModalAlerta({
        visible: true,
        texto: "Corrige los errores antes de continuar.",
      });
      return;
    }

    if (!aceptaDatos) {
      setModalAlerta({
        visible: true,
        texto: "Debes aceptar el tratamiento de tus datos personales.",
      });
      return;
    }

    const payload = { ...formData };
    delete payload.confirmarContraseña;

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/registro",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setModalExito(true);
        setTimeout(() => navigate("/login"), 2500);

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
        setModalAlerta({
          visible: true,
          texto: data.message || "Error al registrarse.",
        });
      }
    } catch (err) {
      setModalAlerta({
        visible: true,
        texto: "No se pudo conectar con el servidor.",
      });
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
          <button className="botonIZQ" onClick={() => navigate("/login")}>
            Iniciar sesión
          </button>

          <button className="botonDER" disabled>
            Registrarse
          </button>
        </div>

        <form className="CardRegister" onSubmit={handleSubmit}>
          {/* Nombre + Apellido */}
          <div className="nombre-apellido-row">
            <div className="contenedor-input-nombre">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                className={`RegisterInput ${
                  errores.nombre
                    ? "input-error"
                    : formData.nombre
                    ? "input-success"
                    : ""
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
              <label htmlFor="apellido">Apellido</label>
              <input
                id="apellido"
                className={`RegisterInput ${
                  errores.apellido
                    ? "input-error"
                    : formData.apellido
                    ? "input-success"
                    : ""
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

          {/* Email */}
          <div className="auth-field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              className={`InputNormal ${
                errores.email
                  ? "input-error"
                  : formData.email
                  ? "input-success"
                  : ""
              }`}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errores.email && <p className="error-text">{errores.email}</p>}
          </div>

          {/* Teléfono */}
          <div className="auth-field">
            <label htmlFor="telefono">Teléfono</label>
            <input
              id="telefono"
              className={`InputNormal ${
                errores.telefono
                  ? "input-error"
                  : formData.telefono
                  ? "input-success"
                  : ""
              }`}
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

          {/* País */}
          <div className="auth-field">
            <label htmlFor="pais">País</label>
            <select
              id="pais"
              className="InputNormal"
              name="pais"
              value={formData.pais}
              onChange={handleChange}
              required
            >
              <option value="Colombia">Colombia</option>
              <option value="México">México</option>
              <option value="Argentina">Argentina</option>
              <option value="Chile">Chile</option>
              <option value="Ecuador">Ecuador</option>
            </select>
          </div>

          {/* Contraseña */}
          <div className="auth-field">
            <label htmlFor="contraseña">Contraseña</label>
            <input
              id="contraseña"
              className={`InputNormal ${
                errores.contraseña
                  ? "input-error"
                  : formData.contraseña
                  ? "input-success"
                  : ""
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

          {/* Confirmar contraseña */}
          <div className="auth-field">
            <label htmlFor="confirmarContraseña">Confirmar contraseña</label>
            <input
              id="confirmarContraseña"
              className={`InputNormal ${
                errores.confirmarContraseña
                  ? "input-error"
                  : formData.confirmarContraseña
                  ? "input-success"
                  : ""
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

          {/* Aceptación de datos */}
          <div className="checkbox-datos">
            <Checkbox
              type="checkbox"
              id="aceptaDatos"
              checked={aceptaDatos}
              onChange={(e) => setAceptaDatos(e.target.checked)}
            ></Checkbox>

            <label htmlFor="aceptaDatos">
              Acepto el{" "}
              <button
                type="button"
                className="link-datos"
                onClick={() => setMostrarModal(true)}
              >
                tratamiento de mis datos personales
              </button>
              .
            </label>
          </div>

          <button className="button-crear-cuenta" type="submit">
            Crear cuenta
          </button>
        </form>
      </div>

      {/* Modal datos personales */}
      {mostrarModal && (
        <div
          className="modal-overlay"
          role="presentation"
          onMouseDown={() => setMostrarModal(false)}
        >
          <div
            className="modal-contenido"
            role="presentation"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h3>Tratamiento de datos personales</h3>
            <p>
              En BikeStore respetamos tu privacidad. Los datos que nos
              proporcionas serán utilizados únicamente para crear tu cuenta.
            </p>
            <button onClick={() => setMostrarModal(false)}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Modal formulario vacío */}
      {modalFormularioVacio && (
        <div
          className="modal-overlay"
          role="presentation"
          onMouseDown={() => setModalFormularioVacio(false)}
        >
          <div
            className="modal-contenido"
            role="presentation"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h3 style={{ color: "red" }}>Formulario incompleto</h3>
            <p>
              Debes llenar el formulario y aceptar los términos y condiciones.
            </p>
            <button onClick={() => setModalFormularioVacio(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal error */}
      {modalAlerta.visible && (
        <div
          className="modal-overlay"
          role="presentation"
          onMouseDown={() => setModalAlerta({ visible: false })}
        >
          <div
            className="modal-contenido"
            role="presentation"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h3 style={{ color: "red" }}>Error</h3>
            <p>{modalAlerta.texto}</p>
            <button onClick={() => setModalAlerta({ visible: false })}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal éxito */}
      {modalExito && (
        <div className="modal-overlay" role="presentation">
          <div className="modal-contenido" role="presentation">
            <h3 style={{ color: "green" }}>✔ Registro exitoso</h3>
            <p>Serás redirigido al inicio de sesión...</p>
          </div>
        </div>
      )}
    </div>
  );
}

RegisterForm.propTypes = {
  setIsRegistering: PropTypes.func.isRequired,
};
