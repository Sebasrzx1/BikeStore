const express = require('express')
const router = express.Router()
const CrudController = require('../controllers/crud.controller');

//Instanciamos el controlador CRUD para utilizarlo en el tema de los productos

const crud = new CrudController()

//Indicamos tabla y campo ID que utilizaremos para este crud de productos.

const tabla = 'productos'
const idCampo = 'id_producto'

//Obtener todos los productos
router.get('/', async(req, res)=>{
    try{
        const productos = await crud.obtenerTodos(tabla);
        res.json(productos);
    }catch(error){
        res.status(500).json({error: error.message})
    }
})

//Obtener producto por su id
router.get('/:id', async(req, res)=>{
    try{
        const producto = await crud.obtenerUno(tabla, idCampo, req.params.id)
        res.json(producto)
    }catch(error){
        res.status(500).json({error: error.message})
    }
})

//Postear, agregar o crear producto
router.post('/', async(req, res) => {
    try{
        const nuevoProducto = await crud.crear(tabla, req.body)
        res.status(201).json(nuevoProducto)
    }catch(error){
        res.status(500).json({error: error.message})
    }
})

//Actualizar producto por su id
router.put('/:id', async(req, res) => {
    try{
        const productoActualizado = await crud.actualizar(tabla, idCampo, req.params.id, req.body);
        res.json(productoActualizado);
    }catch(error){
        res.status(500).json({error: error.message})
    }
})

//Eliminar producto por su id
router.delete('/:id', async(req,res)=>{
    try{
        const productoEliminado = await crud.eliminar(tabla, idCampo, req.params.id);
        res.json(productoEliminado)
    }catch(error){
        res.status(500).json({error: error.message})
    }
});

module.exports = router