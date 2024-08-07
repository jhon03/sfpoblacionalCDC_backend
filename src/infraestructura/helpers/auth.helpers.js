const bcryptjs = require('bcryptjs');
const { buscarUserById, findUserByUsername } = require('./user.helpers');

const validarUsuario = async (idUsuario = "", nombreUsuario="") => {
    try {
        let usuario;
        if (idUsuario) {
            usuario = await buscarUserById(idUsuario);
        } else{
            usuario = await findUserByUsername(nombreUsuario);
        }
        if(!usuario) throw new Error("El usuario con el id: " + idUsuario + " no existe");
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
    validarContrasenaUsuario,
    validarUsuario,
}