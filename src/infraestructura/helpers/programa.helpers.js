const Programa = require('../../dominio/models/programa.models');
const { validarFormato, convertirClavesAMayusculas } = require('./formato.helpers');
const { generarId, obtenerFechaColombia } = require('./globales.helpers');
const { obtenerPersonasEnPrograma } = require('./personas.helpers');

const crearInstanciaPrograma = (datos, colaborador) => {
    try {
        const programa = new Programa({
            idPrograma: generarId(),
            colaborador: colaborador.idColaborador,
            nombrePrograma: datos.nombrePrograma.toUpperCase(),
            fechaCreacion: obtenerFechaColombia(),
            formato: datos.formato,
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

const obtenerProgramaById = async (idPrograma) => {
    try {
        const programa = Programa.findOne({idPrograma});
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
};

const updatePrograma = async (programa, datos = {} ) => {
    let {estado, nombrePrograma, formato} = datos;
    try {

        const personas = await obtenerPersonasEnPrograma(programa.idPrograma);

        if(estado === "ACTIVAR"){
            programa.estado = "ACTIVO";
        } else if(estado === "DESACTIVAR"){
            programa.estado = "INACTIVO";
        } else {
            if(nombrePrograma.toUpperCase() !== programa.nombrePrograma) {
                programa.nombrePrograma = nombrePrograma.toUpperCase();
            };
            if( personas.length > 0 ){
                throw new Error("No se puede actualizar el formato del programa, ya que hay personas en el programa");
            };
            
            formato = convertirClavesAMayusculas(formato);
            validarFormato(formato);
            programa.formato = formato;
        }
    } catch (error) {
        throw new Error(error.message || error);
    }
};




module.exports = {
    buscarProgramaByName,
    crearInstanciaPrograma,
    guardarPrograma,
    obtenerProgramaById,
    obtenerProgramas,
    updatePrograma,
}