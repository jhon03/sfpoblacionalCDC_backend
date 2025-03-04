
class ColaboradorDto {
    constructor(datos, tipoIdentificacion = { nombreIdentificacion: 'Desconocido' }, rol = { nombreRol: 'Sin rol' }) {
        this.id = datos.idColaborador || '';
        this.tipoIdentificacion = tipoIdentificacion.nombreIdentificacion || 'Desconocido';
        this.numeroDocumento = datos.numeroIdentificacion || 'Sin número';
        this.nombre = datos.nombreColaborador || 'Sin nombre';
        this.nombreUsuario = datos.nombreUsuario || 'Sin usuario';
        this.fechaCreacion = datos.fechaCreacion || 'Sin fecha de creación';
        this.fechaModificacion = datos.fechaModificacion || 'Sin modificaciones';
        this.estado = datos.estado || 'Sin estado';
        this.rol = rol.nombreRol || 'Sin rol';
        this.email = datos.email || '';
    }
}

module.exports = ColaboradorDto;