const Persona = require('../../dominio/models/persona.models');

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


module.exports = {
    obtenerPersonasEnPrograma,
}