const myslq = require('mysql2/promise'); //Manejar promesas
const dotenv = require('dotenv'); //Importacion de libreria dotenv para manejar variables de entorno
dotenv.config() //Configuracion para manejar las variables de entorno

//Creacion de pool para la conexion de la base de datos de bikeStore desde Mysql
const pool = myslq.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0 
});

module.exports = pool;