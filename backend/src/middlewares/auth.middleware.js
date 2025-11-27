// middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");

module.exports = function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Token no proporcionado o inválido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "clave_secreta");
    req.usuario = decoded; // Guarda info del token (id_usuario, rol)
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: "Token inválido o expirado" });
  }
};
