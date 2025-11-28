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
    const rol = req.usuario.rol;
    const id_pedido = req.params.id;

    let pedidoData;

    // 🔹 Si es ADMIN puede ver cualquier pedido (ahora incluye los datos del usuario)
    if (rol?.toLowerCase() === "administrador") {
      [pedidoData] = await db.query(
        `SELECT 
            p.id_pedido, p.estado, p.fecha, p.id_usuario,
            u.nombre, u.apellido, u.telefono,
            u.direccion, u.ciudad, u.departamento, 
            u.codigo_postal, u.pais
         FROM pedidos p
         INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
         WHERE p.id_pedido = ?`,
        [id_pedido]
      );

    } else {
      // 🔹 Usuario normal: solo puede ver sus propios pedidos
      [pedidoData] = await db.query(
        `SELECT 
            p.id_pedido, p.estado, p.fecha, p.id_usuario,
            u.nombre, u.apellido, u.telefono,
            u.direccion, u.ciudad, u.departamento, 
            u.codigo_postal, u.pais
         FROM pedidos p
         INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
         WHERE p.id_pedido = ? AND p.id_usuario = ?`,
        [id_pedido, id_usuario]
      );
    }

    if (pedidoData.length === 0) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para ver este pedido",
      });
    }

    const pedido = pedidoData[0];

    // 🔹 Obtener productos del pedido
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
    const connection = await db.getConnection(); // Para transacciones
    try {
      await connection.beginTransaction();

      const id_usuario = req.usuario.id_usuario;
      const { metodo_pago, numero_tarjeta, items } = req.body;

      // Validar datos básicos
      if (!metodo_pago || !numero_tarjeta || !items || items.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Datos incompletos." });
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
            message: `Stock insuficiente para ${item.nombre}. Disponible: ${
              producto[0]?.stock || 0
            }.`,
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
        const totalItem = item.cantidad * item.precio; // Usa el precio del carrito
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
      return res.json({
        success: true,
        message: "Pedido creado exitosamente.",
        id_pedido,
      });
    } catch (error) {
      await connection.rollback();
      console.error("Error en crearPedido:", error);
      return res
        .status(500)
        .json({ success: false, message: "Error al crear el pedido." });
    } finally {
      connection.release();
    }
  }

  async cancelarPedido(req, res) {
    let connection;
    try {
      connection = await db.getConnection();

      const id_pedido = req.params.id;
      const id_usuario = req.usuario.id_usuario;

      await connection.beginTransaction();

      // Validar que el pedido pertenece al usuario y está en estado "En alistamiento"
      const [pedidoRows] = await connection.query(
        "SELECT estado FROM pedidos WHERE id_pedido = ? AND id_usuario = ? FOR UPDATE",
        [id_pedido, id_usuario]
      );

      if (pedidoRows.length === 0) {
        await connection.rollback();
        return res
          .status(404)
          .json({ success: false, message: "Pedido no encontrado" });
      }

      const estadoActual = pedidoRows[0].estado;
      if (estadoActual !== "En alistamiento") {
        await connection.rollback();
        return res
          .status(400)
          .json({
            success: false,
            message: "Solo se pueden cancelar pedidos en alistamiento",
          });
      }

      // Obtener detalles del pedido para devolver stock
      const [detalles] = await connection.query(
        "SELECT id_producto, cantidad FROM detalle_pedido WHERE id_pedido = ?",
        [id_pedido]
      );

      // Devolver stock de cada producto
      for (const detalle of detalles) {
        await connection.query(
          "UPDATE productos SET stock = stock + ? WHERE id_producto = ?",
          [detalle.cantidad, detalle.id_producto]
        );
      }

      // Eliminar detalles del pedido
      await connection.query("DELETE FROM detalle_pedido WHERE id_pedido = ?", [
        id_pedido,
      ]);

      // Eliminar pedido
      await connection.query("DELETE FROM pedidos WHERE id_pedido = ?", [
        id_pedido,
      ]);

      await connection.commit();

      return res.json({
        success: true,
        message: "Pedido eliminado correctamente.",
      });
    } catch (error) {
      if (connection) await connection.rollback();
      console.error("Error eliminando pedido:", error);
      return res
        .status(500)
        .json({ success: false, message: "Error al eliminar el pedido." });
    } finally {
      if (connection) {
        try {
          connection.release();
        } catch (e) {
          console.error("Error liberando conexión:", e);
        }
      }
    }
  }

  async cambiarEstadoPedido(req, res) {
    try {
      const id_pedido = req.params.id;
      const { estado } = req.body;
      // Validar estados válidos
      const estadosPermitidos = ["En alistamiento", "En envío", "Entregados"];
      if (!estadosPermitidos.includes(estado)) {
        return res
          .status(400)
          .json({ success: false, message: "Estado inválido." });
      }
      const [result] = await db.query(
        "UPDATE pedidos SET estado = ? WHERE id_pedido = ?",
        [estado, id_pedido]
      );
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Pedido no encontrado." });
      }
      return res.json({
        success: true,
        message: "Estado del pedido actualizado.",
      });
    } catch (error) {
      console.error("Error en cambiarEstadoPedido:", error);
      return res
        .status(500)
        .json({
          success: false,
          message: "Error al actualizar estado del pedido.",
        });
    }
  }
}
module.exports = new PedidosController();
