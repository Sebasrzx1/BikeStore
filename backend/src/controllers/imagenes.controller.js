const db = require('../config/conexion_db');
const path = require('path');
const fs = require('fs');

// Verifica si existe la carpeta uploads/productos al iniciar el servidor, si no, entonces la crea automaticamente.
const uploadsDir = path.join(__dirname, '../uploads/productos');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Carpeta uploads/productos creada automáticamente');
}

class ImagenesController {
  //Subir la imagen
  async subirImagenProducto(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No se subió ninguna imagen',
        });
      }

      const { id_producto } = req.body;
      const rutaImagen = `/uploads/productos/${req.file.filename}`;

      // Verificamos que el producto exista antes de actualizar
      const [productoExiste] = await db.query(
        'SELECT id_producto, imagen FROM productos WHERE id_producto = ?',
        [id_producto]
      );

      if (productoExiste.length === 0) {
        // Si no existe, eliminamos la imagen recién subida
        fs.unlinkSync(req.file.path);
        return res.status(404).json({
          success: false,
          message: 'El producto no existe',
        });
      }

      // Si ya tiene imagen, eliminamos la anterior del servidor
      const imagenAnterior = productoExiste[0].imagen;
      if (imagenAnterior) {
        const rutaFisica = path.join(__dirname, `..${imagenAnterior}`);
        if (fs.existsSync(rutaFisica)) fs.unlinkSync(rutaFisica);
      }

      // Actualizamos la BD con la nueva ruta
      await db.query('UPDATE productos SET imagen = ? WHERE id_producto = ?', [
        rutaImagen,
        id_producto,
      ]);

      return res.json({
        success: true,
        message: 'Imagen subida y asociada correctamente al producto',
        ruta: rutaImagen,
      });
    } catch (error) {
      console.error('Error al subir imagen:', error);
      res.status(500).json({
        success: false,
        message: 'Error al subir imagen',
      });
    }
  }

  /**
   * 🗑️ Eliminar imagen de un producto
   */
  async eliminarImagenProducto(req, res) {
    try {
      const { id_producto } = req.params;

      const [producto] = await db.query(
        'SELECT imagen FROM productos WHERE id_producto = ?',
        [id_producto]
      );

      if (producto.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
      }

      const imagenRuta = producto[0].imagen;
      if (imagenRuta) {
        const rutaFisica = path.join(__dirname, `..${imagenRuta}`);
        if (fs.existsSync(rutaFisica)) fs.unlinkSync(rutaFisica);
      }

      await db.query('UPDATE productos SET imagen = NULL WHERE id_producto = ?', [id_producto]);

      res.json({
        success: true,
        message: 'Imagen eliminada correctamente',
      });
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar imagen',
      });
    }
  }
}

module.exports = new ImagenesController();
