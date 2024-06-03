const User = require('../../dominio/models/user.models');
const { generarId } = require('./globales.helpers');

const guardarUser = async(user) => {
    try {
        const userG = await user.save();
        return userG;
    } catch (error) {
        throw new Error("Error al guardar el usuario");
    }
};

const buscarUsers = async() => {
    try {
        const usuarios = await User.find({estado:"ACTIVO"});
        return usuarios;
    } catch (error) {
        throw new Error("Error al obtener la lista de usuarios");
    }
};

const crearInstanciaUser = (datos, colaborador) => {
    let { nombreUsuario, contrasena} = datos;
    try {
        const user = new User({
            idUsuario: generarId(),
            colaborador: colaborador.idColaborador,
            nombreUsuario,
            contrasena
        });
        return user;
    } catch (error) {
        throw new Error("Error al crear la instancia del usuario");
    }
};

const buscarUserById = async (idUsuario="", validar=false) => {
    try {
        const user = User.findOne({idUsuario});
        if(validar && user.estado === "INACTIVO"){
            throw new Error("El usuario se encuentra inactivo");
        }
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
};

const buscarUserByColaborador = async (idColaborador, validar=false) => {
    try {
        const user = await User.findOne({colaborador:idColaborador});
        if(validar && user.estado === "INACTIVO"){
            throw new Error("El usuario de encuentra inactivo");
        };
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
};

const cambiarEstadoUser = (user, estado="") => {
    try {
        switch (estado){
            case "ACTIVAR":
                user.estado = "ACTIVO";
                break;
            case "DESACTIVAR":
                user.estado = "INACTIVO";
                break;
            default:
                throw new Error("Estado no permitido");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

const actualizarUser = async (user, datos={}) => {
    let {nombreUsuario, contrasena} = datos;
    try {
        let cambios = false;
        if(nombreUsuario && user.nombreUsuario !== nombreUsuario){
            user.nombreUsuario = nombreUsuario;
            cambios = true;
        };
        if(contrasena && user.contrasena !== contrasena){
            contrasenaEsValida(contrasena);
            user.contrasena = contrasena;
            cambios = true;
        }
        return cambios;
    } catch (error) {
        throw new Error(error.message);
    }
};

const contrasenaEsValida = (contrasena = "") => {
    try {
        if (contrasena.length < 6) {
            throw new Error("6 caracteres");
        };
        if (!/[A-Z]/.test(contrasena)) {
            throw new Error("una mayuscula");
        };
        if (!/[a-z]/.test(contrasena)) {
            throw new Error("una minuscula");
        };
        if (!/[0-9]/.test(contrasena)) {
            throw new Error("un numero");
        };
        
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(contrasena)) {
            throw new Error("un caracter especial");
        }

    } catch (error) {
        throw new Error("la contraseña debe de tener al menos: " + error.message);
    }
}


module.exports = {
    actualizarUser,
    buscarUserByColaborador,
    buscarUserById,
    buscarUsers,
    cambiarEstadoUser,
    contrasenaEsValida,
    crearInstanciaUser,
    guardarUser,
}

