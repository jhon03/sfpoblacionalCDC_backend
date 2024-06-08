

class ColaboradorDto {

    constructor(datos, tipoIdentificacion){
        
        this.id = datos.idColaborador;
        this.tipoIdentificacion = tipoIdentificacion.nombreIdentificacion;
        this.numeroDocumento = datos.numeroIdentificacion;
        this.nombre = datos.nombreColaborador;
        this.edad = datos.edadColaborador;
        this.fechaCreacion = datos.fechaCreacion;
        this.fechaModificacion = datos.fechaModificacion;
    }
};

module.exports = ColaboradorDto;