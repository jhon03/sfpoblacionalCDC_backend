

class UserDto {

    constructor(user, colaborador, rol){
        this.idUsuario     = user.idUsuario;
        this.colaborador   = colaborador.nombreColaborador;
        this.nombreUsuario = user.nombreUsuario;
        this.contrasena    = user.contrasena;
        this.rol           = rol.nombreRol;
        this.estado        = user.estado;
    }

}


module.exports = UserDto;