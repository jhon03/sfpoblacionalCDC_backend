const Rol = require('../../dominio/models/rol.models');
const { generarId } = require('./globales.helpers');
const rolesAutorizados = {
    SUPERUSER: "SUPERUSER",
    ADMINISTRADOR: "ADMINISTRADOR",
    DIRECTOR: "DIRECTOR",
    ADMINISTRADOR_PROYECTOS: "ADMINISTRADOR_PROYECTOS",
    COLABORADOR_NORMAL: "COLABORADOR_NORMAL",
    LIDER_PROYECTOS: " LIDER DE PROYETOS "
};

const allRols = [
    "SUPERUSER", "ADMINISTRADOR", "DIRECTOR", "ADMINISTRADOR_PROYECTOS", "COLABORADOR_NORMAL", " LIDER DE PROYETOS "
]



const guardarRol = async(rol) => {
    try {
        const rolSaved = await rol.save();
        return rolSaved;
    } catch (error) {
        throw new Error(error.message);
    }
};

const crearInstanciaRol = (datos) => {
    let {nombreRol, descripcion} = datos;
    try {
        const rol = new Rol({
            idRol: generarId(),
            nombreRol: nombreRol.toUpperCase(),
            descripcion: descripcion.toUpperCase(),
        });
        return rol;
    } catch (error) {
        throw new Error(error.message);
    }
};

const buscarRoleById = async (idRol="") => {
    try {
        const rol = Rol.findOne({idRol});
        return rol;
    } catch (error) {
        throw new Error(error.message);
    }
};

const buscarRolByName = async (nombreRol="") => {
    try {
        const rol = Rol.findOne({nombreRol:nombreRol.toUpperCase()});
        return rol;
    } catch (error) {
        throw new Error(error.message);
    }
}

const buscarRoles = async (desde, hasta) => {
    try {
        let roles;
        if(desde && hasta) {
            roles = await Rol.find({estado:true})
                    .skip(desde)
                    .limit(hasta);
        };
        roles = await Rol.find({estado:true});
        return roles;

    } catch (error) {
        throw new Error(error.message);
    }
};

const cambiarEstadoRol = (rol, estado="") => {
    try {
        switch (estado){
            case "ACTIVAR":
                rol.estado = true;
                break;
            case "DESACTIVAR":
                rol.estado = false;
                break;
            default:
                throw new Error("Estado no permitido");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateRol = (rol, datos={} ) => {
    let { nombreRol, descripcion } = datos;
    try {
        let cambios = false;
        console.log(nombreRol.toUpperCase() !== rol.nombreRol);
        if(nombreRol && nombreRol.toUpperCase() !== rol.nombreRol){
            rol.nombreRol = nombreRol.toUpperCase();
            cambios = true;
        }
        if(descripcion && descripcion.toUpperCase() !== rol.descripcion){
            rol.descripcion = descripcion.toUpperCase();
            cambios = true;
        };
        return cambios;
    } catch (error) {
        throw new Error(error.message);
    }
};

const crearRolInicial = async () => {
    try {
        const rol = crearInstanciaRol({
            nombreRol: "colaborador",
            descripcion: "Este el rol basico de inicio"
        });
        await rol.save();
        return rol;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    allRols,
    buscarRoleById,
    buscarRoles,
    buscarRolByName,
    cambiarEstadoRol,
    crearInstanciaRol,
    crearRolInicial,
    guardarRol,
    updateRol,
    rolesAutorizados
}