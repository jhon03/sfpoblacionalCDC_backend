const { v4: uuid } = require('uuid');
const bcryptjs = require('bcryptjs');

const generarId = () => {
    try {
        const id = uuid();
        return id;
    } catch (error) {
        throw new Error('Error al crear el id');
    }
};

//implementacion anterior 
const validateCamposPermitidosHelperAnt = (camposIntroducidos, camposPermitidos = [])=> {

    Object.keys( camposIntroducidos ).forEach( ( campo ) => {
        if(!camposPermitidos.includes( campo )) {
            throw new Error(`El campo ${campo} no esta permitido`);
        };
    });
};

const validateCamposPermitidosHelper = (camposIntroducidos, camposPermitidos) => {
    const camposEnviados = Object.keys(camposIntroducidos);
    const camposNoPermitidos = camposEnviados.filter(
        (campo) => !camposPermitidos.includes(campo)
    );

    if (camposNoPermitidos.length > 0) {
        throw new Error(
            `Los siguientes campos no están permitidos: ${camposNoPermitidos.join(
                ", "
            )}`
        );
    }
};

const obtenerFechaColombia = () => {
    const hoy = new Date()
    const opciones = { timeZone: 'America/Bogota' };
    const fechaColombia = hoy.toLocaleString('es-CO', opciones);
    return fechaColombia;
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
    generarId,
    obtenerFechaColombia,
    validateCamposPermitidosHelper
}