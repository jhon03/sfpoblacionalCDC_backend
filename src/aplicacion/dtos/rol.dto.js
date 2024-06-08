

class RolDto {

    constructor(rol){
        this.idRole      = rol.idRole;
        this.nombreRol   = rol.nombreRol;
        this.descripcion = rol.descripcion;
        this.estado      = rol.estado;
    }

};


module.exports = RolDto;