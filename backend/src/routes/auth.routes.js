// routes/auth.routes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// ✅ Registrar usuario
router.post("/registro", async (req, res) => {
  try {
    const resultado = await authController.registrar(req.body);
    res.json(resultado);
  } catch (error) {
    console.error("Error en ruta de registro:", error);
    res.status(500).json({
      success: false,
      message: "Error al registrar usuario",
    });
  }
});

// ✅ Iniciar sesión
router.post("/login", async (req, res) => {
  try {
    const { email, contraseña } = req.body;
    const resultado = await authController.iniciarSesion(email, contraseña);
    res.json(resultado);
  } catch (error) {
    console.error("Error en ruta de login:", error);
    res.status(500).json({
      success: false,
      message: "Error al iniciar sesión",
    });
  }
});

// ✅ (Opcional) Verificar usuario
router.get("/verificar/:id", async (req, res) => {
  try {
    const resultado = await authController.verificarUsuario(req.params.id);
    res.json(resultado);
  } catch (error) {
    console.error("Error al verificar usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error al verificar usuario",
    });
  }
});

module.exports = router;
