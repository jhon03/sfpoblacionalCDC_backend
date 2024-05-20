const Persona    = require('../../dominio/models/persona.models');
const PersonaDto = require('../../aplicacion/dtos/persona.dto');
const { obtenerFechaColombia, generarId } = require('./globales.helpers');

const obtenerPersonasEnPrograma = async (programa) => {
    const { idPrograma } = programa;
    try {
        const personas = await Persona.find({estado: "ACTIVO", programa: idPrograma});
        if(personas.length > 0) {
            throw new Error("No se puede modificar el programa porque ya esta en uso");
        };
        return personas;
    } catch (error) {
        console.log("error en validacion programa helpers: " + error.message);
        throw new Error("El programa ya ha sido utilizado para registrar personas");
    }
};

const crearInstanciaPersona = (datos, programa) => {
    try {
        const persona = new Persona({
            idPersona : generarId(),
            programa: programa.nombrePrograma,
            fechaRegistro: obtenerFechaColombia(),
            datos,
        });
        return persona;
    } catch (error) {
        throw new Error("Error al crear la instancia de la persona");
    }
}


module.exports = {
    crearInstanciaPersona,
    obtenerPersonasEnPrograma,
}