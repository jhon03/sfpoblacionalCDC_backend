

class ColaboradorDto {

    constructor(datos, tipoIdentificacion, rol){

        this.id = datos.idColaborador;
        this.tipoIdentificacion = tipoIdentificacion.nombreIdentificacion;
        this.numeroDocumento = datos.numeroIdentificacion;
        this.nombre = datos.nombreColaborador;
        this.nombreUsuario = datos.nombreUsuario;
        this.fechaCreacion = datos.fechaCreacion;
        this.fechaModificacion = datos.fechaModificacion;
        this.estado = datos.estado;
        this.rol = rol;  
    }
};

module.exports = ColaboradorDto;