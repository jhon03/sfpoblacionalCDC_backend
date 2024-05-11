const TipoIdentificacion = require('../../dominio/models/tipoIdentificacion.models');
const { generarId } = require('./globales.helpers');

const crearInstanciaIdentificacion = (nombreIdentificacion) => {
    try {
        const tipoIdentificacion = new TipoIdentificacion({
            idIdentificacion: generarId(),
            nombreIdentificacion: nombreIdentificacion.toUpperCase()
        });
        return tipoIdentificacion;
    } catch (error) {
        console.log({error: error.message});
        throw new Error('Error al crear la instancia del tipo Identificacion');
    }
};

const guardarIdentificacion = async (identificacion) => {
    try {
        const identificacionGuardada = await identificacion.save();
        return identificacionGuardada;
    } catch (error) {
        console.log({error: error.message});
        throw new Error('Error al guardar el tipo de identificacion');
    }
};

const buscarIdentificaciones = async () => {
    try {
        const Identificaciones = await TipoIdentificacion.find({estado: true});
        return Identificaciones;
    } catch (error) {
        console.log({error: error.message});
        throw new Error('Error al obtener las identificaciones');
    }
};

const buscarIdentificacionByIdOrName = async (idIdentificacion = "", nombreIdentificacion = "") => {
    try {
        //busqueda del tipo de identificacion tanto por nombre como por id
        const identificacion = await TipoIdentificacion.findOne({
            $or: [
                {idIdentificacion},
                {nombreIdentificacion}
            ],
        });
        return identificacion;

    } catch (error) {
        throw new Error('Error al buscar el tipo de identificacion con el id: ' + idIdentificacion);
    }
};

const actualizarIdentificacion = (tipoIdentificacion, campos = {} ) => {
    let { nombreIdentificacion, estado } = campos;
    try {
        if(estado === 'desactivar'){         //cambiamos el estado a false para eliminar la identificacion
            tipoIdentificacion.estado = false;
        } else if(estado === 'activar'){
            tipoIdentificacion.estado = true;
        } else {
            if(nombreIdentificacion.toUpperCase() === tipoIdentificacion.nombreIdentificacion){
                throw new Error('El tipo de identificacion ya tiene el nombre que le deseas colocar');
            }
            tipoIdentificacion.nombreIdentificacion = nombreIdentificacion.toUpperCase();
        }
    } catch (error) {
        console.log({error: error.message});
        throw new Error(error.message);
    }
}

module.exports = {
    actualizarIdentificacion,
    buscarIdentificaciones,
    buscarIdentificacionByIdOrName,
    crearInstanciaIdentificacion,
    guardarIdentificacion,
}