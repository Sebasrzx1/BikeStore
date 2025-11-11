const express = require('express')
const router = express.Router()
const crudController = require('../controllers/crud.controller')
const db = require('../config/conexion_db')
const bcrypt = require('bcrypt')
const verificarToken = require('../middlewares/auth.middleware')

// Instanciamos el controlador
const crud = new crudController()

// Tabla y campo que usaremos para este CRUD
const tabla = 'usuarios'
const idcampo = 'id_usuario'

// ✅ RUTAS CRUD (ya existentes)
router.get('/', async (req, res) => {
  try {
    const personas = await crud.obtenerTodos(tabla)
    res.json(personas)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const persona = await crud.obtenerUno(tabla, idcampo, req.params.id)
    res.json(persona)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const nuevaPersona = await crud.crear(tabla, req.body)
    res.status(201).json(nuevaPersona)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const personaActualizada = await crud.actualizar(tabla, idcampo, req.params.id, req.body)
    res.json(personaActualizada)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const resultado = await crud.eliminar(tabla, idcampo, req.params.id)
    res.json(resultado)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})


// ✅ RUTAS DE PERFIL (protegidas con JWT)

// 🟢 Ver perfil del usuario autenticado
router.get('/perfil/mis-datos', verificarToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id_usuario, nombre, apellido, email, telefono, rol, pais, direccion, ciudad FROM usuarios WHERE id_usuario = ?',
      [req.usuario.id_usuario]
    )

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' })
    }

    res.json({ success: true, usuario: rows[0] })
  } catch (error) {
    console.error('Error al obtener perfil:', error)
    res.status(500).json({ success: false, message: 'Error al obtener perfil' })
  }
})

// 🟡 Actualizar perfil del usuario autenticado
// 🟡 Actualizar perfil del usuario autenticado
router.put('/perfil/actualizar', verificarToken, async (req, res) => {
  try {
    const id_usuario = req.usuario.id_usuario;
    let { nombre, apellido, telefono, pais, direccion, ciudad, contraseñaActual, nuevaContraseña } = req.body;

    // 🔸 Convertir valores vacíos en NULL o número válido
    telefono = telefono === "" ? null : telefono;
    pais = pais === "" ? null : pais;
    direccion = direccion === "" ? null : direccion;
    ciudad = ciudad === "" ? null : ciudad;

    // 🔸 Obtener usuario actual
    const [usuario] = await db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id_usuario]);
    if (usuario.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    let contraseñaHash = usuario[0].contraseña;

    // 🔸 Si se quieren cambiar contraseñas
    if (contraseñaActual && nuevaContraseña) {
      const coincide = await bcrypt.compare(contraseñaActual, usuario[0].contraseña);
      if (!coincide) {
        return res.status(400).json({ success: false, message: 'Contraseña actual incorrecta' });
      }
      contraseñaHash = await bcrypt.hash(nuevaContraseña, 10);
    }

    // 🔸 Ejecutar actualización con valores seguros
    await db.query(
      `UPDATE usuarios 
       SET nombre = ?, apellido = ?, telefono = ?, pais = ?, direccion = ?, ciudad = ?, contraseña = ? 
       WHERE id_usuario = ?`,
      [nombre, apellido, telefono, pais, direccion, ciudad, contraseñaHash, id_usuario]
    );

    res.json({ success: true, message: '✅ Perfil actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar perfil' });
  }
});


module.exports = router
