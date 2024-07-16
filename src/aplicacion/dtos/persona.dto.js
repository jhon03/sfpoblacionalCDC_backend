

class personaDto {

    constructor(persona, programa){

        this.idPersona     = persona.idPersona;
        this.programa      = programa.nombrePrograma;
        this.fechaRegistro = persona.fechaRegistro; 
        this.estado        = persona.estado;
        this.datos         = persona.datos;
    };

};

module.exports = personaDto;