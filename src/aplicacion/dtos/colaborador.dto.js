

class ColaboradorDto {

    constructor(datos, tipoIdentificacion, rol){

        this.id = datos.idColaborador;
        this.tipoIdentificacion = tipoIdentificacion.nombreIdentificacion;
        this.numeroDocumento = datos.numeroIdentificacion;
        this.nombre = datos.nombreColaborador;
        this.fechaCreacion = datos.fechaCreacion;
        this.fechaModificacion = datos.fechaModificacion;
        this.estado = datos.estado;
        this.rol = rol;  // Agregar el rol del usuario asociado
    }
};

module.exports = ColaboradorDto;