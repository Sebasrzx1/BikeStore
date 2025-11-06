import React, { useState } from "react";
import "../../styles/estilosformularios.css";

export default function RegisterForm({ setIsRegistering }) {
  const [mensaje, setMensaje] = useState("");
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [pais, setPais] = useState("Colombia");
  const [rol, setRol] = useState("Cliente");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nombre,
      apellido,
      email,
      contraseña,
      telefono,
      direccion,
      ciudad,
      departamento,
      codigo_postal: codigoPostal,
      pais,
      rol,
    };

    try {
      const response = await fetch("http://localhost:3000/api/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMensaje(`✅ ${data.message || "Registro exitoso"}`);
        setNombre("");
        setApellido("");
        setTelefono("");
        setDireccion("");
        setCiudad("");
        setDepartamento("");
        setCodigoPostal("");
        setPais("Colombia");
        setRol("Cliente");
        setEmail("");
        setContraseña("");
      } else {
        setMensaje(`❌ ${data.message || "Error al registrarse"}`);
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
          <img src="/public/logo.png" alt="BikeStore" className="auth-logo" />
          <h2 className="TituloLogin">¡Bienvenido a BikeStore!</h2>
          <p className="ParrafoLogin">
            Regístrate para comenzar tu aventura ciclista
          </p>
        </div>

        <div className="BotonesLogin">
          <div className="botondir" onClick={() => setIsRegistering(false)}>
            INICIAR SESIÓN
          </div>
          <div className="botondir" onClick={() => setIsRegistering(true)}>
            REGISTRARSE
          </div>
        </div>

        <form className="CardLogin" onSubmit={handleSubmit}>
          {[
            { label: "Nombre", value: nombre, set: setNombre },
            { label: "Apellido", value: apellido, set: setApellido },
            { label: "Teléfono", value: telefono, set: setTelefono },
            { label: "Dirección", value: direccion, set: setDireccion },
            { label: "Ciudad", value: ciudad, set: setCiudad },
            { label: "Departamento", value: departamento, set: setDepartamento },
            { label: "Código Postal", value: codigoPostal, set: setCodigoPostal },
          ].map((campo, i) => (
            <div className="auth-field" key={i}>
              <label>{campo.label}</label>
              <input
                className="LoginInput"
                type="text"
                value={campo.value}
                onChange={(e) => campo.set(e.target.value)}
                required
              />
            </div>
          ))}

          <div className="auth-field">
            <label>País</label>
            <select
              className="LoginInput"
              value={pais}
              onChange={(e) => setPais(e.target.value)}
            >
              <option value="Colombia">Colombia</option>
              <option value="Argentina">Argentina</option>
              <option value="Chile">Chile</option>
              <option value="Ecuador">Ecuador</option>
              <option value="Brazil">Brazil</option>
              <option value="Mexico">Mexico</option>
            </select>
          </div>

          <div className="auth-field">
            <label>Correo electrónico</label>
            <input
              className="LoginInput"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Contraseña</label>
            <input
              className="LoginInput"
              type="password"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
          </div>

          <button className="auth-button" type="submit">
            Crear cuenta
          </button>
        </form>

        {mensaje && <p className="auth-message">{mensaje}</p>}
      </div>
    </div>
  );
}
