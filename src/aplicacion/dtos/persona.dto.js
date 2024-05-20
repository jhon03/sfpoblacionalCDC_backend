

class personaDto {

    constructor(persona, programa){
        this.idPersona = persona.idPersona;
        this.programa  = programa.nombrePrograma;
        this.fechaRegistro = persona.fechaRegistro;
        this.datos     = programa.datos;
    };

};

module.exports = personaDto;