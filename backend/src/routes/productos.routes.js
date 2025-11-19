// routes/productos.routes.js
const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const CrudController = require("../controllers/crud.controller");
const db = require("../config/conexion_db");

const crud = new CrudController();
const tabla = "productos";
const idCampo = "id_producto";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(__dirname, "../uploads/productos");
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Obtener todos
router.get("/", async (req, res) => {
  try {
    const productos = await crud.obtenerTodos(tabla);
    const productosConRuta = productos.map((p) => ({
      ...p,
      imagen_url: p.imagen ? `http://localhost:3000/uploads/productos/${p.imagen}` : null,
    }));
    res.json(productosConRuta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener uno con categoría
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(
      `SELECT 
        p.id_producto, p.nombre_producto, p.marca, p.descripcion, p.precio_unitario,
        p.material, p.peso, p.imagen, p.entradas, p.salidas, p.id_categoria,
        c.nombre_categoria
      FROM productos p
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      WHERE p.id_producto = ?`,
      [id]
    );

    if (!result || result.length === 0) return res.status(404).json({ message: "Producto no encontrado" });

    res.json(result[0]);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Crear (imagen opcional)
router.post("/", upload.single("imagen"), async (req, res) => {
  try {
    const data = { ...req.body };

    // Si multer guardó archivo, asignar nombre
    if (req.file) {
      data.imagen = req.file.filename;
    }

    const nuevoProducto = await crud.crear(tabla, data);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error("Error creando producto:", error);
    res.status(500).json({ error: error.message });
  }
});

// Actualizar (imagen opcional, elimina antigua si reemplaza)
router.put("/:id", upload.single("imagen"), async (req, res) => {
  try {
    const id = req.params.id;
    const data = { ...req.body };

    // Obtener producto actual
    const [rows] = await db.query("SELECT imagen FROM productos WHERE id_producto = ?", [id]);
    const productoActual = rows && rows[0] ? rows[0] : null;
    if (!productoActual) return res.status(404).json({ message: "Producto no encontrado" });

    if (req.file) {
      // nueva imagen: guardar nombre y eliminar archivo viejo (si existe)
      data.imagen = req.file.filename;

      if (productoActual.imagen) {
        const rutaVieja = path.join(__dirname, "../uploads/productos", productoActual.imagen);
        fs.unlink(rutaVieja, (err) => {
          if (err) console.warn("No se pudo eliminar imagen vieja:", rutaVieja, err.message);
        });
      }
    } else {
      // No se subió nueva imagen => conservar la existente
      data.imagen = productoActual.imagen;
    }

    // Evitar enviar cadena vacía como imagen
    if (data.imagen === "" || data.imagen === undefined) {
      data.imagen = productoActual.imagen;
    }

    const actualizado = await crud.actualizar(tabla, idCampo, id, data);
    res.json(actualizado);
  } catch (error) {
    console.error("Error actualizando producto:", error);
    res.status(500).json({ error: error.message });
  }
});

// Eliminar producto (y su imagen si existe)
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Obtener producto para borrar imagen en disco
    const [rows] = await db.query("SELECT imagen FROM productos WHERE id_producto = ?", [id]);
    const producto = rows && rows[0] ? rows[0] : null;

    const eliminado = await crud.eliminar(tabla, idCampo, id);

    if (producto && producto.imagen) {
      const ruta = path.join(__dirname, "../uploads/productos", producto.imagen);
      fs.unlink(ruta, (err) => {
        if (err) console.warn("No se pudo eliminar imagen al borrar producto:", ruta, err.message);
      });
    }

    res.json(eliminado);
  } catch (error) {
    console.error("Error eliminando producto:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
