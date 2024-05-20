const { crearInstanciaPersona } = require("../helpers/personas.helpers");
const { personaToPersonaDto } = require('../../aplicacion/mappers/persona.mappers');

const registrarPersona = async (req, res) => {
    let {programa, body: datos} = req;
    try {
        const persona = crearInstanciaPersona(datos, programa);
        const personaDto = personaToPersonaDto(persona, programa);
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

module.exports = {
    registrarPersona,
}