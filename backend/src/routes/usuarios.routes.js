const express = require("express");
const router = express.Router();
const crudController = require("../controllers/crud.controller");
const db = require("../config/conexion_db");
const bcrypt = require("bcrypt");
const verificarToken = require("../middlewares/auth.middleware");

const crud = new crudController();
const tabla = "usuarios";
const idcampo = "id_usuario";

// ======================================================
// ✅ CRUD BÁSICO
// ======================================================
router.get("/", async (req, res) => {
  try {
    const personas = await crud.obtenerTodos(tabla);
    res.json(personas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const persona = await crud.obtenerUno(tabla, idcampo, req.params.id);
    res.json(persona);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const nuevaPersona = await crud.crear(tabla, req.body);
    res.status(201).json(nuevaPersona);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const personaActualizada = await crud.actualizar(
      tabla,
      idcampo,
      req.params.id,
      req.body
    );
    res.json(personaActualizada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const resultado = await crud.eliminar(tabla, idcampo, req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======================================================
// ✅ PERFIL DE USUARIO (Protegido con JWT)
// ======================================================

// 🟢 Obtener datos del perfil autenticado
router.get("/perfil/mis-datos", verificarToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        id_usuario, nombre, apellido, email, telefono, rol, pais, 
        direccion, ciudad, departamento, codigo_postal
       FROM usuarios WHERE id_usuario = ?`,
      [req.usuario.id_usuario]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    res.json({ success: true, usuario: rows[0] });
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al obtener perfil" });
  }
});

// 🟡 Actualizar perfil (datos personales o contraseña)
router.put("/perfil/actualizar", verificarToken, async (req, res) => {
  try {
    const id_usuario = req.usuario.id_usuario;
    const {
      nombre,
      apellido,
      telefono,
      pais,
      direccion,
      ciudad,
      departamento,
      codigo_postal,
      contraseñaActual,
      nuevaContraseña,
    } = req.body;

    // Buscar usuario actual
    const [rowsUsuario] = await db.query(
      "SELECT * FROM usuarios WHERE id_usuario = ?",
      [id_usuario]
    );
    if (rowsUsuario.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }
    const usuarioActual = rowsUsuario[0];

    const campos = [];
    const valores = [];

    // Campos básicos dinámicos
    if (typeof nombre !== "undefined") {
      campos.push("nombre = ?");
      valores.push(nombre);
    }
    if (typeof apellido !== "undefined") {
      campos.push("apellido = ?");
      valores.push(apellido);
    }
    if (typeof telefono !== "undefined") {
      campos.push("telefono = ?");
      valores.push(telefono);
    }
    if (typeof pais !== "undefined") {
      campos.push("pais = ?");
      valores.push(pais);
    }
    if (typeof direccion !== "undefined") {
      campos.push("direccion = ?");
      valores.push(direccion);
    }
    if (typeof ciudad !== "undefined") {
      campos.push("ciudad = ?");
      valores.push(ciudad);
    }
    if (typeof departamento !== "undefined") {
      campos.push("departamento = ?");
      valores.push(departamento);
    }
    if (typeof codigo_postal !== "undefined") {
      campos.push("codigo_postal = ?");
      valores.push(codigo_postal);
    }

    // Cambio de contraseña
    if (contraseñaActual && nuevaContraseña) {
      const coincide = await bcrypt.compare(
        contraseñaActual,
        usuarioActual.contraseña
      );
      if (!coincide) {
        return res.status(400).json({
          success: false,
          message: "Contraseña actual incorrecta",
        });
      }
      const hashNueva = await bcrypt.hash(nuevaContraseña, 10);
      campos.push("contraseña = ?");
      valores.push(hashNueva);
    }

    if (campos.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No se enviaron campos para actualizar",
      });
    }

    const sql = `UPDATE usuarios SET ${campos.join(", ")} WHERE id_usuario = ?`;
    valores.push(id_usuario);

    await db.query(sql, valores);

    res.json({
      success: true,
      message: "✅ Perfil actualizado correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al actualizar perfil" });
  }
});

// ======================================================
// ✅ RECUPERACIÓN DE CONTRASEÑA (Código temporal en memoria)
// ======================================================

const codigosRecuperacion = {};

// 1️⃣ Solicitar código
router.post("/recuperar", async (req, res) => {
  try {
    const { email } = req.body;

    const [rows] = await db.query(
      "SELECT id_usuario, nombre, telefono, email FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "❌ Este correo no está registrado" });
    }

    const codigo = String(Math.floor(100000 + Math.random() * 900000));
    const expiracion = Date.now() + 10 * 60 * 1000; // 10 minutos

    codigosRecuperacion[email] = { codigo, expiracion };

    // Aquí podrías enviar el código por correo o SMS
    res.json({
      success: true,
      message: "✅ Código generado correctamente",
      codigo, // Temporal, solo para pruebas
    });
  } catch (err) {
    console.error("Error en /recuperar:", err);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
});

// 2️⃣ Verificar código
router.post("/verificar-codigo", async (req, res) => {
  try {
    const { email, codigo } = req.body;
    const data = codigosRecuperacion[email];

    if (!data)
      return res.status(400).json({
        success: false,
        message: "No hay código generado para este correo",
      });

    if (Date.now() > data.expiracion) {
      delete codigosRecuperacion[email];
      return res.status(400).json({
        success: false,
        message: "El código ha expirado, solicita uno nuevo",
      });
    }

    if (String(codigo) !== String(data.codigo)) {
      return res.status(400).json({
        success: false,
        message: "Código incorrecto",
      });
    }

    return res.json({
      success: true,
      message: "✅ Código verificado correctamente",
    });
  } catch (err) {
    console.error("Error en /verificar-codigo:", err);
    res.status(500).json({ success: false, message: "Error interno" });
  }
});

// 3️⃣ Cambiar contraseña (por recuperación)
router.post("/cambiar-contrasena", async (req, res) => {
  try {
    const { email, nuevaContraseña } = req.body;

    const [rows] = await db.query(
      "SELECT contraseña FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });

    const esIgual = await bcrypt.compare(nuevaContraseña, rows[0].contraseña);
    if (esIgual)
      return res.status(400).json({
        success: false,
        message: "La nueva contraseña no puede ser igual a la actual",
      });

    const hash = await bcrypt.hash(nuevaContraseña, 10);
    await db.query("UPDATE usuarios SET contraseña = ? WHERE email = ?", [
      hash,
      email,
    ]);

    delete codigosRecuperacion[email];

    res.json({
      success: true,
      message: "✅ Contraseña actualizada correctamente",
    });
  } catch (err) {
    console.error("Error en /cambiar-contraseña:", err);
    res.status(500).json({ success: false, message: "Error interno" });
  }
});

module.exports = router;
