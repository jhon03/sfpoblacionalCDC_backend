const Rol = require('../../dominio/models/rol.models');
const { generarId } = require('./globales.helpers');

const guardarRol = async(rol) => {
    try {
        const rol = await rol.save();
        return rol;
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

const buscarRoleById = async (idRol="", validar = false) => {
    try {
        const rol = Rol.findOne({idRol});
        if(validar && !rol.estado){
            throw new Error("El rol que deseas buscar se encuentra inactivo");
        };
        return rol;
    } catch (error) {
        throw new Error(error.message);
    }
};

const buscarRoles = async () => {
    try {
        const roles = await Rol.find({estado:true});
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
        if(nombreRol && nombreRol.toUpperCase() !== rol.nombreRol){
            rol.nombreRol = nombreRol.toUpperCase();
            cambios = true;
        }
        if(descripcion && descripcion.toUpperCase() !== rol.descripcion){
            rol.descripcion = descripcion.toUpperCase();
            cambios = true;
        }
    } catch (error) {
        throw new Error(error.message);
    }
}


module.exports = {
    buscarRoleById,
    buscarRoles,
    cambiarEstadoRol,
    crearInstanciaRol,
    crearRol,
    guardarRol,
    updateRol
}