
class tipoIdentificacionDto {

    constructor(tipoIdentificacion){
        this.idIdentificacion     = tipoIdentificacion.idIdentificacion;
        this.nombreIdentificacion = tipoIdentificacion.nombreIdentificacion;
        this.estado               = tipoIdentificacion.estado;
        this.fechaCreacion        = tipoIdentificacion.fechaCreacion;
    }
};


module.exports = tipoIdentificacionDto;