// controllers/auth.controller.js
const db = require("../config/conexion_db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthController {
  // 🔹 Registro
  async registrar({ nombre, apellido, email, contraseña, telefono, rol, pais }) {
    try {
      // Verificar si ya existe el usuario
      const [existe] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
      if (existe.length > 0) {
        return { success: false, message: "El correo ya está registrado" };
      }

      const hash = await bcrypt.hash(contraseña, 10);
      await db.query(
        "INSERT INTO usuarios (nombre, apellido, email, contraseña, telefono, rol, pais) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [nombre, apellido, email, hash, telefono || null, rol || "Cliente", pais || ""]
      );

      return { success: true, message: "Usuario registrado correctamente" };
    } catch (error) {
      console.error("Error en registrar:", error);
      return { success: false, message: "Error al registrar usuario" };
    }
  }

  // 🔹 Login
  async iniciarSesion(email, contraseña) {
    try {
      const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
      if (rows.length === 0)
        return { success: false, message: "Correo o contraseña incorrecta" };

      const usuario = rows[0];
      const coincide = await bcrypt.compare(contraseña, usuario.contraseña);
      if (!coincide)
        return { success: false, message: "Correo o Contraseña incorrecta" };

      const token = jwt.sign(
        {
          id_usuario: usuario.id_usuario,
          rol: usuario.rol,
        },
        process.env.JWT_SECRET || "clave_secreta",
        { expiresIn: "2h" }
      );

      return {
        success: true,
        message: "Inicio de sesión exitoso",
        token,
        usuario: {
          id_usuario: usuario.id_usuario,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          rol: usuario.rol,
        },
      };
    } catch (error) {
      console.error("Error en iniciarSesion:", error);
      return { success: false, message: "Error al iniciar sesión" };
    }
  }

  // 🔹 (Opcional) Verificar usuario por ID
  async verificarUsuario(id) {
    try {
      const [rows] = await db.query("SELECT * FROM usuarios WHERE id_usuario = ?", [id]);
      if (rows.length === 0)
        return { success: false, message: "Usuario no encontrado" };

      return { success: true, usuario: rows[0] };
    } catch (error) {
      console.error("Error en verificarUsuario:", error);
      return { success: false, message: "Error al verificar usuario" };
    }
  }
}

module.exports = new AuthController();
