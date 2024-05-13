const Programa = require('../../dominio/models/programa.models');
const { generarId } = require('./globales.helpers');

const crearInstanciaPrograma = (datos, colaborador) => {
    try {
        const programa = new Programa({
            idPrograma: generarId(),
            colaborador: colaborador.idColaborador,
            nombrePrograma: datos.nombrePrograma.toUpperCase(),
            formato: datos.formato
        });
        return programa;
    } catch (error) {
        throw new Error("Error al crear la instancia del programa");
    }
}

const guardarPrograma = async (programa) => {
    try {
        const programaGuard = await programa.save();
        return programaGuard;
    } catch (error) {
        throw new Error("Error al guardar el programa");
    }
};

const obtenerProgramaById = async (idProgrma) => {
    try {
        const programa = Programa.findOne({idProgrma});
        return programa;
    } catch (error) {
        throw new Error("Error al obtener el programa");
    }
};

const obtenerProgramas = async() => {
    try {
        const programas = await Programa.find({estado:"ACTIVO"});
        return programas;
    } catch (error) {
        throw new Error("Errro al obtener los programas");
    }
};

const buscarProgramaByName = async( nombrePrograma = "") => {
    try {
        const programa = await Programa.findOne({
            nombrePrograma: nombrePrograma.toUpperCase(), 
            estado: "ACTIVO"
        });
        return programa;
    } catch (error) {
        throw new Error("Error al buscar el programa con el nombre: " + nombrePrograma)
    }
}



module.exports = {
    buscarProgramaByName,
    crearInstanciaPrograma,
    guardarPrograma,
    obtenerProgramaById,
    obtenerProgramas,
}