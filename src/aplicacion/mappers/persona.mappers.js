
const Persona    = require('../../dominio/models/persona.models');
const PersonaDto = require('../dtos/persona.dto');
const { obtenerProgramaById } = require('../../infraestructura/helpers/programa.helpers');

const personaToPersonaDto = (persona, programa) => {
    try {
        const personaDto = new PersonaDto(persona,programa);
        return personaDto;
    } catch (error) {
        throw new Error("Error al mapear la persona a un dto");
    }
};

const personasToPersonasDto = async(personas) => {
    try {
        const personasDtoPromises = personas.map(async persona => {
            const programa = await obtenerProgramaById(persona.programa);
            return personaToPersonaDto(persona, programa);
        });
        const personasDto = await Promise.all(personasDtoPromises);
        return personasDto;
    } catch (error) {
        throw new Error("Error al mapear a las personas");
    }
}


module.exports = {
    personaToPersonaDto,
    personasToPersonasDto,
}