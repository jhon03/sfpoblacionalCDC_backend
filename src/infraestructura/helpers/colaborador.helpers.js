const Colaborador = require('../../dominio/models/colaborador.models');
const { generarId } = require('./globales.helpers');

const crearInstanciaColaborador = (datos) => {
    const {tipoIdentificacion, numeroIdentificacion, nombreColaborador, edadColaborador} = datos;
    try {
        const colaborador = new Colaborador({
            idColaborador: generarId(),
            tipoIdentificacion,
            numeroIdentificacion,
            nombreColaborador,
            edadColaborador
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
        throw new Error("Error al guardar el colaborador");
    }
};

const obtenerColaboradores = async() => {
    try {
        const listaColaboradores = await Colaborador.find({estado:"ACTIVO"});
        return listaColaboradores;
    } catch (error) {
        throw new Error("Error al obtener los colaboradores");
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
        throw new Error("Error al obtener el colaborador por el documento del colaborador");
    }
}


module.exports = {
    crearInstanciaColaborador,
    guardarColaborador,
    obtenerColaboradores,
    obtenerColaboradorByIdentificacion,
}