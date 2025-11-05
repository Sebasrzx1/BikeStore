const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const imagenesController = require('../controllers/imagenes.controller');

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/productos'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Ruta para subir imagen
router.post('/subir', upload.single('imagen'), (req, res) =>
  imagenesController.subirImagenProducto(req, res)
);

// Ruta para eliminar imagen
router.delete('/eliminar/:id_producto', (req, res) =>
  imagenesController.eliminarImagenProducto(req, res)
);

module.exports = router;
