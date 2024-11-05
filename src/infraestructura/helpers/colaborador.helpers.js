const Colaborador = require('../../dominio/models/colaborador.models');
const { generarId, obtenerFechaColombia } = require('./globales.helpers');

const crearInstanciaColaborador = (datos) => {
    const {tipoIdentificacion, numeroIdentificacion, nombreColaborador} = datos;
    try {
        const colaborador = new Colaborador({
            idColaborador: generarId(),
            tipoIdentificacion,
            numeroIdentificacion,
            nombreColaborador: nombreColaborador.toUpperCase(),
            fechaCreacion: obtenerFechaColombia(),
        });
        return colaborador;
    } catch (error) {
        throw new Error("Error al crear la instancia del colaborador");
    }
};

const guardarColaborador = async (colaborador) => {
    try {
        const colaboradorG = await colaborador.save();
        return colaboradorG;
    } catch (error) {
        throw new Error(error.message);
    }
};

const obtenerColaboradores = async(desde=0, limite=5) => {
    try {
        const listaColaboradores =
            await Colaborador.find({estado:"ACTIVO"})
                .skip(desde)
                .limit(limite);
        return listaColaboradores;
    } catch (error) {
        throw new Error(error.message);
    }
};

const obtenerColaboradorByIdentificacion = async (numeroIdentificacion) => {
    try {
        const colaborador = Colaborador.findOne({
            numeroIdentificacion,
            estado:"ACTIVO"
        })
        return colaborador;
    } catch (error) {
        throw new Error(error.message);
    }
};

const cambiarEstadoColaborador = (colaborador, estado = "") => {
    try {
        switch (estado) {
            case "ACTIVAR":
                colaborador.estado = "ACTIVO";
                break;
            case "DESACTIVAR":
                colaborador.estado = "INACTIVO";
                break
            default:
                throw new Error("Estado no permitido");
        }
    } catch (error) {
        throw new Error("Error al cambiar el estado del colaborador: " + error.message);
    }
};

const buscarColaboradorByIdOrDocumento = async (idColaborador="", numeroIdentificacion = "" ) => {
    try {

        const colaborador = await Colaborador.findOne({
            $or: [
                {idColaborador},
                {numeroIdentificacion}
            ],
        });
        return colaborador;
    } catch (error) {
        throw new Error("Error al buscar el colaborador");
    }
};

//pendiente
const updateColaborador = (colaborador, datos = {}) => {
    let {nombreColaborador,  tipoIdentificacion, numeroIdentificacion, estado} = datos;

    try {

        if (datos.nombreColaborador){
            const nombreColaborador = datos.nombreColaborador.toUpperCase();
            if( nombreColaborador === colaborador.nombreColaborador){
                throw new Error("El nombre que deseas colocar ya lo tienes");
            }
            colaborador.nombreColaborador = nombreColaborador;
        }
        if (tipoIdentificacion) {
            colaborador.tipoIdentificacion = tipoIdentificacion;
        }

            colaborador.fechaModificacion = obtenerFechaColombia();
       //nombreColaborador = nombreColaborador.toUpperCase();


    } catch (error) {
        throw new Error(error.message);
    }
}


module.exports = {
    buscarColaboradorByIdOrDocumento,
    crearInstanciaColaborador,
    cambiarEstadoColaborador,
    guardarColaborador,
    obtenerColaboradores,
    obtenerColaboradorByIdentificacion,
    updateColaborador,
}