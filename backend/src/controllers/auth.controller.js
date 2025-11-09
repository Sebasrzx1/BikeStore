const db = require('../config/conexion_db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'clave_secreta';

class AuthController {
    /* ------------ Registro de usuarios ------------ */
    async registrar(usuarioData) {
        try {
            const [emailExistente] = await db.query(
                'SELECT email FROM usuarios WHERE email = ?',
                [usuarioData.email]
            );

            if (emailExistente.length > 0) {
                return {
                    success: false,
                    message: 'El email ya está registrado',
                };
            }

            const saltosRondas = 10;
            const passwordHasheada = await bcrypt.hash(usuarioData.contraseña, saltosRondas);

            const usuarioNuevo = {
                ...usuarioData,
                contraseña: passwordHasheada,
            };

            const [resultado] = await db.query('INSERT INTO usuarios SET ?', [usuarioNuevo]);

            return {
                success: true,
                message: 'Usuario registrado correctamente en BikeStore',
                userID: resultado.insertId,
            };
        } catch (error) {
            console.error('Error al registrar el usuario:', error);
            throw error;
        }
    }

    /* ------------ Inicio de Sesión ------------ */
    async iniciarSesion(email, contraseña) {
    try {
        console.log('🟡 Intentando iniciar sesión con:', email);

        const [usersLogin] = await db.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );

        console.log('🟢 Resultado de búsqueda:', usersLogin);

        if (usersLogin.length === 0) {
            console.log('🔴 No se encontró el usuario');
            return {
                success: false,
                message: 'El correo o la contraseña no coinciden',
            };
        }

        const usuario = usersLogin[0];
        console.log('🧩 Usuario encontrado:', usuario);

        const passwordMatch = await bcrypt.compare(contraseña, usuario.contraseña);
        console.log('🔐 Comparación de contraseña:', passwordMatch);

        if (!passwordMatch) {
            console.log('🔴 Contraseña incorrecta');
            return {
                success: false,
                message: 'El correo o la contraseña no coinciden',
            };
        }

        const token = jwt.sign(
            { id: usuario.id_usuario, email: usuario.email, rol: usuario.rol },
            SECRET_KEY,
            { expiresIn: '30h' }
        );

        console.log('✅ Token generado correctamente');

        return {
            success: true,
            message: 'Inicio de sesión exitoso',
            token,
            usuario: {
                id: usuario.id_usuario,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
            },
        };
    } catch (error) {
        console.error('❌ Error en iniciar sesión:', error);
        return {
            success: false,
            message: 'Error interno al iniciar sesión',
            error: error.message,
        };
    }
}

    /* ------------ Verificación de usuario ------------ */
    async verificarUsuario(userId) {
        try {
            const [usuarios] = await db.query(
                'SELECT id_usuario, nombre, apellido, email, rol FROM usuarios WHERE id_usuario = ?',
                [userId]
            );

            if (usuarios.length === 0) {
                return { success: false, message: 'Usuario no encontrado' };
            }

            return { success: true, usuario: usuarios[0] };
        } catch (error) {
            console.log('Error al verificar usuario:', error);
            throw error;
        }
    }
}

module.exports = new AuthController();
