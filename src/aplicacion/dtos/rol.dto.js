

class RolDto {

    constructor(rol){
        this.idRol       = rol.idRol;
        this.nombreRol   = rol.nombreRol;
        this.descripcion = rol.descripcion;
        this.estado      = rol.estado;
    }

};


module.exports = RolDto;