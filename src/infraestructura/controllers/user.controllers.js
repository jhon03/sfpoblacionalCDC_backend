const { userToUserDto } = require("../../aplicacion/mappers/user.mapper");
const { crearInstanciaUser, guardarUser } = require("../helpers/user.helpers");



const crearUser = async(req, res) => {
    const {body:datos} = req;
    try {
        const user = crearInstanciaUser(datos);
        const userSaved = await guardarUser(user);
        const userDto = userToUserDto(userSaved);
        return res.status(201).json({
            msg: "usuario creado correctamente",
            user: userDto
        })
    } catch (error) {
        return res.status(400).json({
            msg:"Error al crear el usuario",
            error: error.message
        })
    }
};

const buscarRolById = async(req, res) => {
    const { user } = req;
    try {
        const userDto = userToUserDto(user);
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

