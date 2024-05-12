const Programa = require('../../dominio/models/programa.models');

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
}

module.exports = {
    guardarPrograma,
    obtenerProgramaById,
    obtenerProgramas,
}