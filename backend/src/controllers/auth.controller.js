const db = require('../config/conexion_db'); //Importamos base de datos de BikeStore.
const bcrypt = require('bcrypt'); //Importamos libreria para encriptar contraseñas
const jwt = require('jsonwebtoken') //Importamos libreria para manejar tokens en los inicio de sesion.
const SECRET_KEY = process.env.JWT_SECRET || 'clave_secreta_bikestore'

class AuthController{

/* ------------ Registro de usuarios.  ------------*/  
    
    async registrar(usuarioData){
        try{
            //Intentamos verificar si el email ingresado ya existe o esta asociado a una cuenta ya registrada.
            const[emailExistente] = await db.query('SELECT email FROM usuarios WHERE email = ?')

            if(emailExistente.lenght > 0){
                return{
                    success: false,
                    message:'El email ya esta registrado'
                }
            }

            //Encriptamos la contraseña
            const saltosRondas = 10;
            const passwordHasheada = await bcrypt.hash(usuarioData.contraseña, saltosRondas)

            //Creacion del usuario como objeto con su contraseña encriptada.
            const usuarioNuevo = {
                ...usuarioData,
                contraseña:passwordHasheada
            }

            //Cuando el usuario esta creado como un objeto por ultimo lo insertamos directamente a la base datos de bikestore.

            const[resultado] = await db.query('INSERT INTO usuarios SET ?',[usuarioNuevo])

            return{
                success: true,
                mesagge: 'Usuario registrado correctamente en BikeStore',
                userID: resultado.insertId
            }
        }catch(error){
            console.error('Error al registrar el usuario', error);
            throw error
        }
    }



/* ------------ Inicio de Sesión de los usuarios.  ------------*/  
    async iniciarSesion(email, contraseña){
        try{
            //Buscamos el usuario por el email
            const [usersLogin] = await db.query('SELECT * FROM email = ?',[email])

            if(usersLogin.lenght === 0){
                return{
                    success: false,
                    mesagge: 'El correo o la contraseña no coinciden'
                }
            }

            const usuario = usersLogin[0]

            //Verificamos su contraseña
            const passwordMatch = await bcrypt.compare(contraseña, usuario.contraseña)

            if(!passwordMatch){
                return{
                    success: false,
                    message: "El correo o la contraseña no coinciden"
                }
            }

            //Creamos un token con los datos de los usuarios (excluyendo la contraseña)

            const token = jwt.sing(
                { id: usuario.id_usuario, email: usuario.email, rol: usuario.rol}, 
                SECRET_KEY, 
                {expiresIn: '30h'}
            )

            //Retornar los datos del usuario y el token
            return {
                success: true,
                message: 'Inicio de sesión exitoso',
                token,
                usuario: {
                id: usuario.id_usuario,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
                }
            };
            
        }catch(error){
            console.error('Error en iniciar Sesion: ', error);
            throw error
        }
    }

}

module.exports = new AuthController()