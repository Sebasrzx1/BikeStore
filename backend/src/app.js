const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

//Servir imágenes estáticas
app.use ('/uploads', express.static(path.join(__dirname, 'uploads')))

// Rutas
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/imagenes', require('./routes/imagenes.routes'))

module.exports = app;
