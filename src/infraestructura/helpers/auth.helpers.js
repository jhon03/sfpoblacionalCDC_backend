const bcryptjs = require('bcryptjs');
const { buscarUserById, findUserByUsername } = require('./user.helpers');

const validarUsuario = async (idUsuario = "", nombreUsuario="") => {
    try {
        let usuario;
        let mensaje;
        if (idUsuario) {
            usuario = await buscarUserById(idUsuario);
            mensaje = "El usuario con el id: " + idUsuario + " no existe";
        } else{
            usuario = await findUserByUsername(nombreUsuario);
            mensaje = "El usuario con el nombre de usuario: " + nombreUsuario + " no existe";
        }
        if(!usuario) throw new Error(mensaje);
        return usuario;
    } catch (error) {
        throw error;
    }
}

const validarContrasenaUsuario = (usuario, contrasena = '') => {
    try {
        const validarContrasena = bcryptjs.compareSync( contrasena, usuario.contrasena);
        if(!validarContrasena){
            throw new Error(`La contraseña es incorrecta`);
        }  
    } catch (error) {
        throw error;
    }
};


module.exports = {
    validarContrasenaUsuario,
    validarUsuario,
}