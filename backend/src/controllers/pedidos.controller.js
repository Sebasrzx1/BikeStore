const db = require("../config/conexion_db");

class PedidosController {
  // 🔹 Obtener pedidos del usuario logueado
  async obtenerMisPedidos(req, res) {
    try {
      const id_usuario = req.usuario.id_usuario;

      const [pedidos] = await db.query(
        `SELECT p.id_pedido, p.estado, p.fecha
         FROM pedidos p
         WHERE p.id_usuario = ?
         ORDER BY p.fecha DESC`,
        [id_usuario]
      );

      for (let pedido of pedidos) {
        const [items] = await db.query(
          `SELECT dp.id_detalle, dp.id_producto, dp.cantidad,
                  pr.nombre_producto, pr.precio_unitario, pr.imagen AS imagen_url,
                  (dp.cantidad * pr.precio_unitario) AS total_item
           FROM detalle_pedido dp
           INNER JOIN productos pr ON dp.id_producto = pr.id_producto
           WHERE dp.id_pedido = ?`,
          [pedido.id_pedido]
        );
        pedido.total = items.reduce((acc, item) => acc + item.total_item, 0);
        pedido.items = items;
      }

      return res.json({ success: true, pedidos });
    } catch (error) {
      console.error("Error en obtenerMisPedidos:", error);
      return res
        .status(500)
        .json({ success: false, message: "Error al obtener pedidos" });
    }
  }

  // 🔹 Obtener todos los pedidos (ADMIN)
  async obtenerTodosLosPedidos(req, res) {
    try {
      // No validas el rol aquí, porque ya lo controlas desde el frontend
      const [pedidos] = await db.query(`
      SELECT 
        p.id_pedido,
        p.fecha,
        p.estado,
        u.nombre AS nombre_usuario,
        u.email
      FROM pedidos p
      INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
      ORDER BY p.fecha DESC
    `);

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

        pedido.total = items.reduce((acc, item) => acc + item.total_item, 0);
        pedido.items = items;
      }

      return res.json({ success: true, data: pedidos });
    } catch (error) {
      console.error("Error en obtenerTodosLosPedidos:", error);
      return res
        .status(500)
        .json({ success: false, message: "Error al obtener pedidos" });
    }
  }

  // 🔹 Obtener detalle de un pedido específico (cliente)
  async obtenerPedidoPorId(req, res) {
    console.log("Usuario autenticado:", req.usuario);

    try {
      const id_usuario = req.usuario.id_usuario;
      const id_pedido = req.params.id;

      const [pedidoData] = await db.query(
        `SELECT id_pedido, estado, fecha
         FROM pedidos
         WHERE id_pedido = ? AND id_usuario = ?`,
        [id_pedido, id_usuario]
      );

      if (pedidoData.length === 0) {
        return res
          .status(403)
          .json({
            success: false,
            message: "No tienes permiso para ver este pedido",
          });
      }

      const pedido = pedidoData[0];
      const [items] = await db.query(
        `SELECT dp.id_detalle, dp.id_producto, dp.cantidad,
                pr.nombre_producto, pr.precio_unitario, pr.imagen AS imagen_url,
                (dp.cantidad * pr.precio_unitario) AS total_item
         FROM detalle_pedido dp
         INNER JOIN productos pr ON dp.id_producto = pr.id_producto
         WHERE dp.id_pedido = ?`,
        [id_pedido]
      );

      pedido.total = items.reduce((acc, item) => acc + item.total_item, 0);
      pedido.items = items;

      return res.json({ success: true, pedido });
    } catch (error) {
      console.error("Error en obtenerPedidoPorId:", error);
      return res
        .status(500)
        .json({ success: false, message: "Error al obtener el pedido" });
    }
  }

  // 🔹 Crear un nuevo pedido
  async crearPedido(req, res) {
    const connection = await db.getConnection();  // Para transacciones
    try {
      await connection.beginTransaction();

      const id_usuario = req.usuario.id_usuario;
      const { metodo_pago, numero_tarjeta, items } = req.body;

      // Validar datos básicos
      if (!metodo_pago || !numero_tarjeta || !items || items.length === 0) {
        return res.status(400).json({ success: false, message: "Datos incompletos." });
      }

      // Verificar stock suficiente para todos los items
      for (const item of items) {
        const [producto] = await connection.query(
          "SELECT stock, precio_unitario FROM productos WHERE id_producto = ?",
          [item.id_producto]
        );
        if (!producto[0] || producto[0].stock < item.cantidad) {
          await connection.rollback();
          return res.status(400).json({
            success: false,
            message: `Stock insuficiente para ${item.nombre}. Disponible: ${producto[0]?.stock || 0}.`,
          });
        }
      }

      // Insertar pedido
      const [pedidoResult] = await connection.query(
        "INSERT INTO pedidos (id_usuario, estado, metodo_pago, Numero_tarjeta) VALUES (?, 'En alistamiento', ?, ?)",
        [id_usuario, metodo_pago, numero_tarjeta]
      );
      const id_pedido = pedidoResult.insertId;

      // Insertar detalles y reducir stock
      for (const item of items) {
        const totalItem = item.cantidad * item.precio;  // Usa el precio del carrito
        await connection.query(
          "INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, total) VALUES (?, ?, ?, ?)",
          [id_pedido, item.id_producto, item.cantidad, totalItem]
        );
        await connection.query(
          "UPDATE productos SET stock = stock - ? WHERE id_producto = ?",
          [item.cantidad, item.id_producto]
        );
      }

      await connection.commit();
      return res.json({ success: true, message: "Pedido creado exitosamente.", id_pedido });
    } catch (error) {
      await connection.rollback();
      console.error("Error en crearPedido:", error);
      return res.status(500).json({ success: false, message: "Error al crear el pedido." });
    } finally {
      connection.release();
    }
  }

}

module.exports = new PedidosController();
