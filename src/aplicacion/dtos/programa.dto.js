
class ProgramaDto {

    constructor(programa, colaboradorCreador, colaboradorAsignado){
        this.id                           = programa.idPrograma;
        this.IdColaborador                = colaboradorCreador.idColaborador;
        this.colaborador                  = colaboradorCreador.nombreColaborador;
        this.estado                       = programa.estado;
        this.nombrePrograma               = programa.nombrePrograma;
        this.informacion                  = programa.informacion;
        this.fechaCreacion                = programa.fechaCreacion;
        this.IdcolaboradorResponsable     = colaboradorAsignado ? colaboradorAsignado.idColaborador : "" ;
        this.nombreColaboradorResponsable = colaboradorAsignado ? colaboradorAsignado.nombreColaborador : "";
        this.formato                      = programa.formato;
    }
};


module.exports = ProgramaDto;