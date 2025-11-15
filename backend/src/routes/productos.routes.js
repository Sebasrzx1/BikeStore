// routes/productos.routes.js
const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const CrudController = require("../controllers/crud.controller");
const db = require("../config/conexion_db");

// Instancia del CRUD genérico
const crud = new CrudController();

// Datos de la tabla
const tabla = "productos";
const idCampo = "id_producto";

/* ---------------------- MULTER (SUBIR IMÁGENES) ----------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/productos"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ----------------------------- RUTAS ---------------------------------- */

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const productos = await crud.obtenerTodos(tabla);

    const productosConRuta = productos.map((p) => ({
      ...p,
      imagen_url: p.imagen
        ? `http://localhost:3000/uploads/productos/${p.imagen}`
        : null,
    }));

    res.json(productosConRuta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Obtener un producto por ID con categoría
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      `SELECT 
          p.id_producto,
          p.nombre_producto,
          p.marca,
          p.descripcion,
          p.precio_unitario,
          p.material,
          p.peso,
          p.imagen,
          p.entradas,
          p.salidas,
          c.nombre_categoria
       FROM productos p
       LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
       WHERE p.id_producto = ?`,
      [id]
    );

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(result[0]);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Crear producto con imagen
router.post("/", upload.single("imagen"), async (req, res) => {
  try {
    const data = req.body;

    // Si hay archivo, guardar nombre en BD
    if (req.file) {
      data.imagen = req.file.filename;
    }

    const nuevoProducto = await crud.crear(tabla, data);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar producto con nueva imagen opcional
router.put("/:id", upload.single("imagen"), async (req, res) => {
  try {
    const data = req.body;

    if (req.file) {
      data.imagen = req.file.filename;
    }

    const actualizado = await crud.actualizar(
      tabla,
      idCampo,
      req.params.id,
      data
    );
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar producto
router.delete("/:id", async (req, res) => {
  try {
    const eliminado = await crud.eliminar(tabla, idCampo, req.params.id);
    res.json(eliminado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
