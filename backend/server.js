const express = require('express')
const app = require('./src/app')
require('dotenv').config()

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor de BikeStore corriendo en el puerto ${PORT}}`)
})


