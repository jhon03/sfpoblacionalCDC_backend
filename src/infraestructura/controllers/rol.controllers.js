const { rolToRolDto, rolsToRolsDto } = require("../../aplicacion/mappers/rol.mapper");
const { crearInstanciaRol, guardarRol, buscarRoles, cambiarEstadoRol, updateRol, buscarRolByName } = require("../helpers/rol.helpers")

const crearRol = async (req, res) => {
    const { body: datos } = req;
    try {
        const rolName = await buscarRolByName(datos.nombreRol);
        if( rolName && rolName.estado ){
            throw new Error(`El nombre ${datos.nombreRol} ya existe como rol`)
        }
        const rol = await crearInstanciaRol(datos);
        const rolSaved = await guardarRol(rol);
        const rolDto = rolToRolDto(rolSaved);
        return res.status(201).json({
            msg: "Rol creado con exito",
            rol: rolDto
        })
    } catch (error) {
        return res.status(400).json({
            msg: "Error al crear el rol",
            error: error.message
        })
    }
};

const FindRolById = (req, res) => {
    const { rol } = req;
    try {
        const rolDto = rolToRolDto(rol);
        return res.json({
            msg: "El rol ha sido encontrado correctamente",
            rol: rolDto
        })
    } catch (error) {
        return res.status(400).json({
            msg: "Error al buscar el rol con el id que estas buscando",
            error: error.message
        })
    }
};

const findRoles = async (req, res) => {
    try {
        const roles = await buscarRoles();
        const rolesDto = rolsToRolsDto(roles);
        return res.json({
            msg: `Se encontraron ${roles.length} roles`,
            roles: rolesDto
        })
    } catch (error) {
        return res.status(400).json({
            msg: "Error al buscar los roles",
            error: error.message
        })
    }
};

const activarRol = async (req, res) => {
    let { rol } = req;
    try {
        if(rol.estado) throw new Error("El rol ya se encuetra activo");
        cambiarEstadoRol(rol, "ACTIVAR");
        await guardarRol(rol);
        const rolDto = rolToRolDto(rol);
        return res.json({
            msg: "Rol activado correctamente",
            rol: rolDto
        })
    } catch (error) {
        return res.status(400).json({
            msg: "Error al activar el rol",
            error: error.message
        })
    }
};

const desactivarRol = async (req, res) => {
    let {rol} = req;
    try {
        if(!rol.estado) throw new Error("El rol se encuentra esta inactivo");
        cambiarEstadoRol(rol, "DESACTIVAR");
        await guardarRol(rol);
        const rolDto = rolToRolDto(rol);
        return res.json({
            msg:"Rol desactivado correctamente",
            rol: rolDto
        })
    } catch (error) {
        return res.status(400).json({
            msg: "Error al desactivar el rol",
            error: error.message
        })
    }
};

const actualizarRol = async (req, res) => {
    let {rol, body: datos} = req;
    try {
        const cambios = updateRol(rol, datos);
        if(!cambios) throw new Error("No has realizado ningun cambio en el rol");
        await guardarRol(rol);
        const rolDto = rolToRolDto(rol);
        return res.json({
            msg: "Rol actualizado correctamente",
            rol: rolDto
        })
    } catch (error) {
        return res.status(400).json({
            msg: "Error al actualizar el rol",
            error: error.message
        })
    }
};

module.exports = {
    activarRol,
    actualizarRol,
    crearRol,
    desactivarRol,
    findRoles,
    FindRolById,  
}

