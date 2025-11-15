const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/auth.middleware");
const PedidosController = require("../controllers/pedidos.controller");

// Obtener pedidos del usuario
router.get("/mis-pedidos", verificarToken, (req, res) =>
  PedidosController.obtenerMisPedidos(req, res)
);

// Obtener un pedido por ID
router.get("/:id", verificarToken, (req, res) =>
  PedidosController.obtenerPedidoPorId(req, res)
);

module.exports = router;
