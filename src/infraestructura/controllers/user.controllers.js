const { userToUserDto, usersToUsersDto } = require("../../aplicacion/mappers/user.mapper");
const { buscarColaboradorByIdOrDocumento } = require("../helpers/colaborador.helpers");
const { buscarRolByName, crearRolInicial } = require("../helpers/rol.helpers");
const { crearInstanciaUser, guardarUser, buscarUsers, cambiarEstadoUser, actualizarUser, buscarUserById } = require("../helpers/user.helpers");


//funcion para crear el usuario
const crearUser = async(colaborador, datos, rol) => {
    try {
        const user = crearInstanciaUser(datos, colaborador, rol); 
        const userSaved = await guardarUser(user);
        const userDto = userToUserDto(userSaved, colaborador, rol);
        return userDto;
    } catch (error) {
        throw new Error("Error al crear el usuario del colaborador");
    }
};

const findUsers = async(req, res) => {
    try {
        const users = await buscarUsers();
        const usersDto = await usersToUsersDto(users);
        return res.json({
            msg: `Se encontraron ${usersDto.length} usuarios `,
            usuarios: usersDto
        })
    } catch (error) {
        return res.status(400).json({
            msg: "Error al buscar los usuarios",
            error: error.message
        })
    }
}


const findUserById = async(req, res) => {
    const { user } = req;
    try {
        const colaborador = await buscarColaboradorByIdOrDocumento(user.colaborador);
        const userDto = userToUserDto(user, colaborador);
        return res.json({
            msg: "Usuario encontrado correctamente",
            usuario: userDto
        })
    } catch (error) {
        return res.status(400).json({
            msg: "Error al buscar el rol por id",
            error: error.message
        })
    }
};

const activarUser = async (req, res) => {
    let { user } = req; 
    try {
        if(user.estado === "ACTIVO") throw new Error("El usuario se encunetra activo")
        cambiarEstadoUser(user, "ACTIVAR");
        const colaborador = await buscarColaboradorByIdOrDocumento(user.colaborador);
        const userDto = userToUserDto(user, colaborador);
        return res.json({
            msg:"Usuario activado correctamente",
            usuario: userDto
        })
    } catch (error) {
        return res.status(400).json({
            msg:"Error al activar el usuario",
            error: error.message
        })
    }
};

const desactivarUser = async (req, res) => {
    let { user } = req; 
    try {
        if(user.estado === "INACTIVO") throw new Error("El usuario se encuentra inactivo")
        cambiarEstadoUser(user, "DESACTIVAR");
        const colaborador = await buscarColaboradorByIdOrDocumento(user.colaborador);
        const userDto = userToUserDto(user, colaborador);
        return res.json({
            msg:"Usuario desactivado correctamente",
            usuario: userDto
        })
    } catch (error) {
        return res.status(400).json({
            msg:"Error al activar el usuario",
            error: error.message
        })
    }
};

const updateUser = async (req, res) => {
    let { user, body: datos } = req;
    try {
        
        const hayCambios = actualizarUser(user, datos);
        if(!hayCambios){
            throw new Error("No has hecho ningun cambio en el usuarios")
        };
        const userSaved = await guardarUser(user);
        const colaborador = await buscarColaboradorByIdOrDocumento(user.colaborador);
        const userDto = userToUserDto(userSaved, colaborador);
        return res.json({
            msg: "Usuario actualizado correctamente",
            usuario: userDto
        })
        
    } catch (error) {
        return res.status(400).json({
            msg:"Error al actualizar el usuario",
            error: error.message
        })
    }
}

module.exports = {
    activarUser,
    desactivarUser,
    crearUser,
    findUserById,
    findUsers,
    updateUser,
}