const { userToUserDto } = require("../../aplicacion/mappers/user.mapper");
const { validarUsuario, validarContrasenaUsuario } = require("../helpers/auth.helpers");
const { buscarColaboradorByIdOrDocumento } = require("../helpers/colaborador.helpers");
const { generarJWT } = require("../helpers/jwt.helpers");
const { buscarRoleById } = require("../helpers/rol.helpers");

const login = async(req, res) => {
    try {
        const {nombreUsuario, contrasena} = req.body;      
        const user = await validarUsuario("",nombreUsuario);
        const colaborador = await buscarColaboradorByIdOrDocumento(user.colaborador);
        const rol = await buscarRoleById(user.rol);
        const userDto = userToUserDto(user, colaborador, rol);
        validarContrasenaUsuario(user, contrasena);

        const token = await generarJWT(user.idUsuario);   //generar el JWT
        //const refreshToken = await generarJWTRefresh(usuario.id);       //genera un token de refresco cada vez que inicia sesion
        //asignarTokenRefresh(usuario.id, refreshToken);
        return res.json({
            msg: `bienvenido ${user.nombreUsuario} has iniciado sesion correctamente`,
            usuario: userDto,
            token,
        })
        
    } catch (error) {
        return res.status(400).json({
            msg: "Error al iniciar sesion",
            error: error.message
        })
    }
};

const registro =  (req, res) => {
    try {
        return res.status(201).json({
            msg: "Registro exitoso"
        })
    } catch (error) {
        
    }
}

module.exports = {
    login,
    registro
}