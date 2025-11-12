const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config(); // 🟢 Para leer las variables del archivo .env (por ejemplo, JWT_SECRET)

const app = express();

// 🟢 Middlewares globales
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 🟢 Servir imágenes estáticas (por ejemplo, fotos de productos o usuarios)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🟢 Rutas principales
app.use('/api/auth', require('./routes/auth.routes')); // Login / Registro
app.use('/api/usuarios', require('./routes/usuarios.routes')); // Perfil y CRUD usuarios
app.use('/api/imagenes', require('./routes/imagenes.routes'));
app.use('/api/productos', require('./routes/productos.routes'));
app.use('/api/categorias', require('./routes/categorias.routes'));

// 🟢 Ruta base de prueba
app.get('/', (req, res) => {
  res.send('✅ API de BikeStore funcionando correctamente');
});

module.exports = app;
