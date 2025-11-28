const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/auth.middleware");
const PedidosController = require("../controllers/pedidos.controller");

// Cliente: obtener sus pedidos
router.get("/mis-pedidos", verificarToken, PedidosController.obtenerMisPedidos);

// ADMIN: obtener todos los pedidos
router.get("/todos", verificarToken, PedidosController.obtenerTodosLosPedidos);

// ADMIN / CLIENTE: obtener detalle del pedido
router.get("/:id", verificarToken, PedidosController.obtenerPedidoPorId);

// ADMIN: cambiar estado
router.put("/:id/estado", verificarToken, PedidosController.cambiarEstadoPedido);

// Cliente: cancelar pedido
router.put("/:id/cancelar", verificarToken, PedidosController.cancelarPedido);

// Crear pedido
router.post("/crear-pedido", verificarToken, PedidosController.crearPedido);

module.exports = router;
