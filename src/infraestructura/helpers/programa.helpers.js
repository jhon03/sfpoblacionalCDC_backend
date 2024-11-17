const Programa = require('../../dominio/models/programa.models');
const { validarFormato, convertirClavesAMayusculas } = require('./formato.helpers');
const { generarId, obtenerFechaColombia } = require('./globales.helpers');
const { obtenerPersonasEnPrograma } = require('./personas.helpers');
const Colaborador = require('../../dominio/models/colaborador.models');
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

const obtenerProgramas = async(desde=0, limite=5) => {
    try {
        const programas = await
            Programa.find({estado:"ACTIVO"})
            .skip(desde)
            .limit(limite);
        return programas;
    } catch (error) {
        throw error;
    }
};

const obtenerProgramaConfirmacion = async (desde=0, hasta=5) => {
    try {
        const programas= await
            Programa.find({estado:"EN PROCESO CONFIRMACION"})
                .skip(desde)
                .limit(hasta);

                console.log("Programas obtenidos:", programas);  // Verificar qué programas se están obteniendo

                if (!programas || programas.length === 0) {
                    throw new Error("No se encontraron programas en proceso de confirmación.");
                }

            // Obtener los idColaborador de los programas obtenidos
        const colaboradoresIds = programas.map(prog => prog.colaboradorCreador);
        console.log("IDs de colaboradores:", colaboradoresIds);  // Verificar los ID de colaboradores


        // Asegurarse de que los idColaborador se manejan como cadenas de texto (UUID)
        const colaboradoresExistentes = await Colaborador.find({
            idColaborador: { $in: colaboradoresIds } // Aseguramos que sea idColaborador y no _id
        }).select('idColaborador'); // Seleccionamos solo el idColaborador para eficiencia

        console.log("Colaboradores existentes:", colaboradoresExistentes);  // Verificar qué colaboradores existen

        // Crear un conjunto con los colaboradores que existen en la base de datos
        const colaboradoresMap = new Set(colaboradoresExistentes.map(col => col.idColaborador));

        // Filtrar programas cuya propiedad 'colaboradorCreador' sea un id que existe en colaboradoresMap
        const programasValidos = programas.filter(prog => colaboradoresMap.has(prog.colaboradorCreador));

        console.log("Programas válidos:", programasValidos);  // Verificar los programas que quedan después del filtro

        return programasValidos;

    }catch (error) {
        console.error("Error en obtenerProgramaConfirmacion:", error);
        throw error;
    }
}

const buscarProgramaByName = async( nombrePrograma = "") => {
    try {
        const programa = await Programa.findOne({
            nombrePrograma: nombrePrograma.toUpperCase(),
            estado:  { $in: ["ACTIVO", "EN PROCESO CONFIRMACION"] }
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