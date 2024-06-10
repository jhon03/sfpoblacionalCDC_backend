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

const encryptarContra = (datos) => {
    try {
      const salt = bcryptjs.genSaltSync();  //encriptar nueva contraseña
      datos.contrasena= bcryptjs.hashSync( datos.contrasena, salt);
    } catch (error) {
      throw new Error(`Error al encryptar la contraseña: ${error.message}`);
    }
}

module.exports = {
    encryptarContra,
    validarContrasenaUsuario
}