const Programa = require('../../dominio/models/programa.models');
const { validarFormato, convertirClavesAMayusculas } = require('./formato.helpers');
const { generarId, obtenerFechaColombia } = require('./globales.helpers');
const { obtenerPersonasEnPrograma } = require('./personas.helpers');

const crearInstanciaPrograma = (datos, colaborador) => {
    try {
        const programa = new Programa({
            idPrograma: generarId(),
            colaboradorCreador: colaborador.idColaborador,
            nombrePrograma: datos.nombrePrograma.toUpperCase(),
            fechaCreacion: obtenerFechaColombia(),
            informacion: datos.informacion,
        });
        return programa;
    } catch (error) {
        throw error;
    }
}

const guardarPrograma = async (programa) => {
    try {
        const programaGuard = await programa.save();
        return programaGuard;
    } catch (error) {
        throw error;
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

const obtenerProgramaConfirmacion = async () => {
    try {
        const programas= await Programa.find({estado:"EN PROCESO CONFIRMACION"});
        return programas;
    } catch (error) {
        throw error;
    }
}

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
    let {estado, nombrePrograma, informacion} = datos;
    try {

        const personas = await obtenerPersonasEnPrograma(programa.idPrograma);

        if(estado === "ACTIVAR"){
            programa.estado = "ACTIVO";
        } else if(estado === "DESACTIVAR"){
            programa.estado = "INACTIVO";
        } else if(estado === "CONFIRMAR"){
            programa.estado = "ACTIVO";
        } else {
            if(nombrePrograma.toUpperCase() !== programa.nombrePrograma) {
                programa.nombrePrograma = nombrePrograma.toUpperCase();
            };

            informacion = convertirClavesAMayusculas(informacion);
            //validarFormato(informacion); 
            programa.informacion = informacion;


            
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
    obtenerProgramaConfirmacion,
    updatePrograma,
}