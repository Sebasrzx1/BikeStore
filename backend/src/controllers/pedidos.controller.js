const db = require("../config/conexion_db");

class PedidosController {

  // 🔹 Obtener pedidos del usuario logueado
  async obtenerMisPedidos(req, res) {
    try {
      const id_usuario = req.usuario.id_usuario; // viene del token

      // 1️⃣ Traer los pedidos del usuario
      const [pedidos] = await db.query(
        `SELECT 
          p.id_pedido,
          p.estado,
          p.fecha
        FROM pedidos p
        WHERE p.id_usuario = ?
        ORDER BY p.fecha DESC`,
        [id_usuario]
      );

      // 2️⃣ Para cada pedido traer sus productos
      for (let pedido of pedidos) {
        const [items] = await db.query(
          `SELECT 
            dp.id_detalle,
            dp.id_producto,
            dp.cantidad,
            pr.nombre_producto,
            pr.precio_unitario,
            pr.imagen AS imagen_url,
            (dp.cantidad * pr.precio_unitario) AS total_item
          FROM detalle_pedido dp
          INNER JOIN productos pr ON dp.id_producto = pr.id_producto
          WHERE dp.id_pedido = ?`,
          [pedido.id_pedido]
        );

        // Total calculado del pedido
        pedido.total = items.reduce((acc, item) => acc + item.total_item, 0);

        // Agregar items al pedido
        pedido.items = items;
      }

      return res.json({
        success: true,
        message: "Pedidos obtenidos correctamente",
        pedidos
      });

    } catch (error) {
      console.error("Error en obtenerMisPedidos:", error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener pedidos"
      });
    }
  }

  // 🔹 Obtener detalle de un pedido específico
  async obtenerPedidoPorId(req, res) {
    try {
      const id_usuario = req.usuario.id_usuario;
      const id_pedido = req.params.id;

      // Validar que el pedido pertenece al usuario
      const [pedidoData] = await db.query(
        `SELECT id_pedido, estado, fecha 
         FROM pedidos 
         WHERE id_pedido = ? AND id_usuario = ?`,
        [id_pedido, id_usuario]
      );

      if (pedidoData.length === 0) {
        return res.status(403).json({
          success: false,
          message: "No tienes permiso para ver este pedido"
        });
      }

      const pedido = pedidoData[0];

      // Obtener items
      const [items] = await db.query(
        `SELECT 
          dp.id_detalle,
          dp.id_producto,
          dp.cantidad,
          pr.nombre_producto,
          pr.precio_unitario,
          (dp.cantidad * pr.precio_unitario) AS total_item
        FROM detalle_pedido dp
        INNER JOIN productos pr ON dp.id_producto = pr.id_producto
        WHERE dp.id_pedido = ?`,
        [id_pedido]
      );

      // Total calculado
      pedido.total = items.reduce((acc, item) => acc + item.total_item, 0);
      pedido.items = items;

      return res.json({
        success: true,
        message: "Pedido encontrado",
        pedido
      });

    } catch (error) {
      console.error("Error en obtenerPedidoPorId:", error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener el pedido"
      });
    }
  }
}

module.exports = new PedidosController();
