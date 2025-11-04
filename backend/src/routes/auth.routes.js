const express = require('express');
const router = express.Router()
const authController = require('../controllers/auth.controller');

//Ruta para registrar un nuevo usuario
router.post('/registro', async(req, res)=>{
    try{
        const resultado = await authController.registrar(req.body)
        res.json(resultado)
    }catch(error){
        console.error('Error en ruta de registro', error)
        res.status(500).json({
            success: false,
            message:'Error al registrar usuario'
        })
    }
})

//Ruta para iniciar sesion
router.post('/login', async(req, res)=>{
    try{
        const {email, contraseña} = req.body
        const resultado = await authController.iniciarSesion(email, contraseña)

        if(resultado.success){
            //Si se utilizan sesiones, aqui estableceria la sesion por ahora, simplemente devolvemos el resultado exitoso.
        }
    }catch(error){
        console.error('Error en ruta de login: ', error)
        res.status(500).json({
            success: false,
            message: 'Error al iniciar sesion'
        })
    }
})

//Ruta para verificar si un usuario esta autenticado.

router.get('/verificar/:id', async(req,res)=>{
    try{
        const resultado = await authController.verificarUsuario()

        if(resultado.success){
            res.json(resultado)
        }else{
            res.status(404).json(resultado)
        }
    }catch(error){
        console.error('Error al verificar usuario:', error)
        res.status(500).json({
            success: false,
            message: 'Error al verificar usuario'
        })
    }
})