const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/auth.middleware");
const PedidosController = require("../controllers/pedidos.controller");

// Cliente: obtener sus pedidos
router.get("/mis-pedidos", verificarToken, (req, res) =>
  PedidosController.obtenerMisPedidos(req, res)
);

router.get("/todos", verificarToken, (req, res) =>
  PedidosController.obtenerTodosLosPedidos(req, res)
);

// Cliente: obtener detalle de un pedido
router.get("/:id", verificarToken, (req, res) =>
  PedidosController.obtenerPedidoPorId(req, res)
);


module.exports = router;
