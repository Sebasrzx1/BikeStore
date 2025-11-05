import React, { useState } from "react";

export default function LoginRegisterForm() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Campos comunes
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");

  // Campos adicionales para registro
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

    const endpoint = isRegistering
      ? "http://localhost:3000/api/auth/registro"
      : "http://localhost:3000/api/auth/login";

    const payload = isRegistering
      ? {
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
        }
      : { email, contraseña };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMensaje(`✅ ${data.message || "Operación exitosa"}`);

        if (isRegistering) {
          // Limpia campos de registro
          setNombre("");
          setApellido("");
          setTelefono("");
          setDireccion("");
          setCiudad("");
          setDepartamento("");
          setCodigoPostal("");
          setPais("Colombia");
          setRol("Cliente");
        } else {
          // Guardar token y datos de usuario
          localStorage.setItem("token", data.token);
          localStorage.setItem("rol", data.usuario.rol);
          localStorage.setItem("nombre", data.usuario.nombre);
        }

        setEmail("");
        setContraseña("");
      } else {
        setMensaje(`❌ ${data.message || "Error en la operación"}`);
      }
    } catch (error) {
      console.error(error);
      setMensaje("❌ No se pudo conectar con el servidor");
    }
  };

  return (
    <div className="form-container">
      <h2>{isRegistering ? "Registro de Usuario" : "Inicio de Sesión"}</h2>
      <form onSubmit={handleSubmit}>
        {isRegistering && (
          <>
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
            />
            <input
              type="tel"
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Dirección"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Ciudad"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Departamento"
              value={departamento}
              onChange={(e) => setDepartamento(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Código Postal"
              value={codigoPostal}
              onChange={(e) => setCodigoPostal(e.target.value)}
              required
            />
            <select value={pais} onChange={(e) => setPais(e.target.value)}>
              <option value="Colombia">Colombia</option>
              <option value="Argentina">Argentina</option>
              <option value="Chile">Chile</option>
              <option value="Ecuador">Ecuador</option>
              <option value="Brazil">Brazil</option>
              <option value="Mexico">Mexico</option>
            </select>
          </>
        )}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
        />

        <button type="submit">
          {isRegistering ? "Registrarse" : "Iniciar Sesión"}
        </button>
      </form>

      <button onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering
          ? "¿Ya tienes cuenta? Inicia sesión"
          : "¿No tienes cuenta? Regístrate"}
      </button>

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}
