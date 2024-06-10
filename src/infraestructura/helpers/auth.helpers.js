const bcryptjs = require('bcryptjs');

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
    validarContrasenaUsuario
}