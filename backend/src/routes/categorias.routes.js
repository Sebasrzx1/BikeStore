const express = require('express')
const router = express.Router()
const CrudController = require('../controllers/crud.controller');

//Instanciamos el controlador CRUD para utilizarlo en el tema de los productos

const crud = new CrudController()

//Indicamos tabla y campo ID que utilizaremos para este crud de productos.

const tabla = 'categorias'
const idCampo = 'id_categoria'

//Obtener todos los productos
router.get('/', async(req, res)=>{
    try{
        const categorias = await crud.obtenerTodos(tabla);
        res.json(categorias);
    }catch(error){
        res.status(500).json({error: error.message})
    }
})

//Obtener producto por su id
router.get('/:id', async(req, res)=>{
    try{
        const categoria = await crud.obtenerUno(tabla, idCampo, req.params.id)
        res.json(categoria)
    }catch(error){
        res.status(500).json({error: error.message})
    }
})

//Postear, agregar o crear producto
router.post('/', async(req, res) => {
    try{
        const nuevaCategoria = await crud.crear(tabla, req.body)
        res.status(201).json(nuevaCategoria)
    }catch(error){
        res.status(500).json({error: error.message})
    }
})

//Actualizar producto por su id
router.put('/:id', async(req, res) => {
    try{
        const categoriaActualizada = await crud.actualizar(tabla, idCampo, req.params.id, req.body);
        res.json(categoriaActualizada);
    }catch(error){
        res.status(500).json({error: error.message})
    }
})

//Eliminar producto por su id
router.delete('/:id', async(req,res)=>{
    try{
        const categoriaEliminada = await crud.eliminar(tabla, idCampo, req.params.id);
        res.json(categoriaEliminada)
    }catch(error){
        res.status(500).json({error: error.message})
    }
});

module.exports = router