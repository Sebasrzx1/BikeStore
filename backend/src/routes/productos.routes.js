const express = require('express');
const router = express.Router();
const CrudController = require('../controllers/crud.controller');
const db = require('../config/conexion_db'); // ✅ Agregado

// Instanciamos el controlador CRUD
const crud = new CrudController();

// Tabla y campo ID
const tabla = 'productos';
const idCampo = 'id_producto';

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await crud.obtenerTodos(tabla);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Obtener un producto por ID con categoría incluida
router.get('/:id', async (req, res) => {
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
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Crear producto
router.post('/', async (req, res) => {
  try {
    const nuevoProducto = await crud.crear(tabla, req.body);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar producto
router.put('/:id', async (req, res) => {
  try {
    const productoActualizado = await crud.actualizar(tabla, idCampo, req.params.id, req.body);
    res.json(productoActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar producto
router.delete('/:id', async (req, res) => {
  try {
    const productoEliminado = await crud.eliminar(tabla, idCampo, req.params.id);
    res.json(productoEliminado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
