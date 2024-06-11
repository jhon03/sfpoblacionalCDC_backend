const { crearInstanciaPersona, guardarPersona, obtenerPersonas, getPersonaById, updatePersona } = require("../helpers/personas.helpers");
const { personaToPersonaDto, personasToPersonasDto } = require('../../aplicacion/mappers/persona.mappers');
const { convertirValuesToUpperCase } = require("../helpers/formato.helpers");
const { obtenerProgramaById } = require("../helpers/programa.helpers");
const { buscarIdentificacionByIdOrName } = require("../helpers/tipoIdentificacion.helpers");

const registrarPersona = async (req, res) => {
    let {programa, body: datos} = req;
    try {
        const formatoReg = convertirValuesToUpperCase(datos);  //convertir los datos de la persona a mayusculas
        const persona = crearInstanciaPersona(formatoReg, programa);
        const personaGuardada = await guardarPersona(persona);
        const personaDto = personaToPersonaDto(personaGuardada, programa);
        return res.status(201).json({
            msg:"Persona registrada correctamente en el programa: " + programa.nombrePrograma,
            persona: personaDto
        })
    } catch (error) {
        return res.status(400).json({
            msg: "Error al registrar la persona",
            error: error.message
        })
    }
};

const obtenerListaPersonas = async(req, res) => {
    try {
        const personas = await obtenerPersonas();
        const personasDto = await personasToPersonasDto(personas);
        return res.json({
            msg: `Se encontraron ${personas.length} registros`,
            personas: personasDto,
        })
    } catch (error) {
        return res.status(400).json({
            msg: "Error al obtener la lista de personas",
            error: error.message
        })
    }
};

const obtenerPersonaById = async (req, res) => {
    const { persona } = req;
    try {
        const programa = await obtenerProgramaById(persona.programa);
        const personaDTO = personaToPersonaDto(persona, programa);
        return res.json({
            msg: "Persona encontrada",
            persona: personaDTO
        })
    } catch (error) {
        return res.status(400).json({
            msg: "Error al obtener la persona",
            error: error.message
        })
    }
};

const actualizarPersona = async (req, res) => {
    let { persona, body: datos } = req;
    try {
        const programa = await obtenerProgramaById(persona.programa);
        updatePersona(persona, {datos} );
        const personaAct = await guardarPersona(persona);
        const personaDto = personaToPersonaDto(personaAct, programa);
        return res.json({
            msg: "Datos de la persona actualizados correctamente",
            persona: personaDto
        })
    } catch (error) {
        return res.status(400).json({
            msg: "Error al actualizar los datos de la persona",
            error: error.message,
        })
    }
};

const desactivarPersona = async (req, res) => {
    let { persona } = req;
    try {
        if(persona.estado === "INACTIVO"){
            throw new Error("La persona actualmente se encuentra inactiva");
        }
        const programa = await obtenerProgramaById(persona.programa);
        updatePersona(persona, {estado:"DESACTIVAR"});
        const personaAct = await guardarPersona(persona);
        const personaDto = personaToPersonaDto(personaAct, programa);
        return res.json({
            msg: "Persona desactivada correctamente",
            persona:personaDto,
        })
    } catch (error) {
        return res.status(400).json({
            msg: "Error al desactivar a la persona",
            error: error.message
        })
    }
};

const activarPersona = async (req, res) => {
    let { persona } = req;
    try {
        if(persona.estado === "ACTIVO"){
            throw new Error("La persona actualmente se encuentra activa");
        }
        const programa = await obtenerProgramaById(persona.programa);
        updatePersona(persona, {estado:"ACTIVAR"});
        const personaActivada = await guardarPersona(persona);
        const personaDto = personaToPersonaDto(personaActivada, programa);
        return res.json({
            msg: "Persona activada correctamente",
            persona:personaDto,
        })
    } catch (error) {
        return res.status(400).json({
            msg: "Error al activar a la persona",
            error: error.message
        })
    }
};

module.exports = {
    activarPersona,
    actualizarPersona,
    desactivarPersona,
    registrarPersona,
    obtenerListaPersonas,
    obtenerPersonaById,
}