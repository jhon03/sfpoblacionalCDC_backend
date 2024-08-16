const Rol = require('../../dominio/models/rol.models');
const { generarId } = require('./globales.helpers');

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

const buscarRoles = async (desde=0, hasta=5) => {
    try {
        const roles = 
            await Rol.find({estado:true})
                .skip(desde)
                .limit(hasta);
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
    buscarRoleById,
    buscarRoles,
    buscarRolByName,
    cambiarEstadoRol,
    crearInstanciaRol,
    crearRolInicial,
    guardarRol,
    updateRol
}