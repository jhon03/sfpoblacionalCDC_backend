const { v4: uuid } = require('uuid');
const bcryptjs = require('bcryptjs');
const { Mongoose } = require('mongoose');

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
};


const obtenerPaginasDisponibles = async(modelo, estadoBuscado = {}, numeroSaltosPag = 5) => {
    try {
        const allModels = await modelo.find(estadoBuscado);
        const totalPaginas = Math.ceil(allModels.length / numeroSaltosPag);
        return totalPaginas;
    } catch (error) {
        throw error;
    }
};

const getPagesAvalaible = async(modelo, busqueda={estado:"ACTIVO"}, limit, page) => {
    try {
        page = Number(page);
        if(isNaN(page) || page <= 0) throw new Error("El argumento page es requerido y debe ser un numero positivo");
        const paginasDisponibles = await obtenerPaginasDisponibles(modelo , busqueda, limit);
        if(paginasDisponibles < page) throw new Error("No existe la pagina: " + page);
        return paginasDisponibles;
    } catch (error) {
        throw error;
    }
}

const cambiarEstado = (modelo, estado = "") => {
    try {
        switch (estado) {
            case "ACTIVAR":
                modelo.estado = "ACTIVO";
                break;
            case "DESACTIVAR":
                modelo.estado = "INACTIVO";
                break
            default:
                throw new Error("Estado no permitido");
        }
    } catch (error) {
        throw new Error("Error al cambiar el estado: " + error.message);
    }
};

//helper para crear numero de 100 a 9000
const num_random = () => {
    return Math.floor(100 + Math.random() * 9000)
}

const guardarModelo = async (modelo) => {
    try {
        const modeloSaved = await modelo.save();
        return modeloSaved;
    } catch (error) {
        throw error;
    }
}




module.exports = {
    cambiarEstado,
    num_random,
    generarId,
    getPagesAvalaible,
    obtenerFechaColombia,
    validateCamposPermitidosHelper,
    encryptarContra,

}