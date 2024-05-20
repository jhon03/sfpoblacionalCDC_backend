
class ProgramaDto {

    constructor(programa, colaborador){
        this.id                   = programa.idPrograma;
        this.documentoColaborador = colaborador.numeroIdentificacion;
        this.colaborador          = colaborador.nombreColaborador;
        this.estado               = programa.estado;
        this.nombrePrograma       = programa.nombrePrograma;
        this.fechaCreacion        = programa.fechaCreacion;
        this.formato              = programa.formato;
    }
};


module.exports = ProgramaDto;