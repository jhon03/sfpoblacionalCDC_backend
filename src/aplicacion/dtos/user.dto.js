

class UserDto {

    constructor(user, colaborador, rol){
        this.idUsuario         = user.idUsuario;
        this.idColaborador     = colaborador.idColaborador;
        this.nombreColaborador = colaborador.nombreColaborador;
        this.nombreUsuario     = user.nombreUsuario;
        this.rol               = rol.nombreRol;
        this.estado            = user.estado;
    }

}


module.exports = UserDto;