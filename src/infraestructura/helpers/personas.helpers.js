const Persona    = require('../../dominio/models/persona.models');
const PersonaDto = require('../../aplicacion/dtos/persona.dto');
const { obtenerFechaColombia, generarId } = require('./globales.helpers');
const { convertirValuesToUpperCase } = require('./formato.helpers');

const obtenerPersonasEnPrograma = async (programa) => {
    const { idPrograma } = programa;
    try {
        const personas = await Persona.find({estado: "ACTIVO", programa: idPrograma});
        return personas;
    } catch (error) {
        console.log("error en validacion programa helpers: " + error.message);
        throw new Error("El programa ya ha sido utilizado para registrar personas");
    }
};

const obtenerPersonas = async () => {
    try {
        const personas = await Persona.find({estado: "ACTIVO"});
        return personas;
    } catch (error) {
        throw new Error("Error al obtener las personas");
    }
}

const crearInstanciaPersona = (datos, programa) => {
    try {
        const persona = new Persona({
            idPersona : generarId(),
            programa: programa.idPrograma,
            fechaRegistro: obtenerFechaColombia(),
            datos,
        });
        return persona;
    } catch (error) {
        throw new Error("Error al crear la instancia de la persona");
    }
};

const guardarPersona = async(persona) => {
    try {
        const personaSaved = await persona.save();
        return personaSaved;
    } catch (error) {
        throw new Error("Error al guardar el registro de la persona");
    }
};

const getPersonaById = async(idPersona) => {
    try {
        const personaObtenida = await Persona.findOne({idPersona});
        return personaObtenida;
    } catch (error) {
        throw new Error("Error al obtener la persona con el id: "+ persona.idPersona);
    }
};

const updatePersona = (persona, accionesAct = {}) => {
    let {estado, datos} = accionesAct;
    try {
        if(estado === "ACTIVAR"){
            persona.estado = "ACTIVO";
        } else if(estado === "DESACTIVAR"){
            persona.estado = "INACTIVO";
        } else {
            datos = convertirValuesToUpperCase(datos);
            persona.datos = datos;
        }
    } catch (error) {
        throw new Error(error.message);
    }
}


module.exports = {
    crearInstanciaPersona,
    guardarPersona,
    obtenerPersonasEnPrograma,
    getPersonaById,
    obtenerPersonas,
    updatePersona,
}