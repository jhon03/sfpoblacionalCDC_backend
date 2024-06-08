

class UserDto {

    constructor(user, colaborador){
        this.idUsuario     = user.idUsuario;
        this.colaborador   = colaborador.nombreColaborador;
        this.nombreUsuario = user.nombreUsuario;
        this.contrasena    = user.contrasena;
        this.estado        = user.estado;
    }

}


module.exports = UserDto;