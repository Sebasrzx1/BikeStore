const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware'); // opcional: proteger checkout
const PayuController = require('../controllers/payu.controller');

// Protegemos checkout para que el usuario esté autenticado
router.post('/checkout', verificarToken, PayuController.checkout);

// (Más adelante añadiremos /confirmation para procesar el IPN de PayU)

module.exports = router;
