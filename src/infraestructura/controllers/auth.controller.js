const { userToUserDto } = require("../../aplicacion/mappers/user.mapper");
const { validarUsuario, validarContrasenaUsuario } = require("../helpers/auth.helpers");
const { buscarColaboradorByIdOrDocumento } = require("../helpers/colaborador.helpers");
const { generarJWT, generarJWTRefresh, validarExpiracionToken, decodificarToken, obtenerToken, verificarToken, manejarTokenDeRefresco } = require("../helpers/jwt.helpers");
const { buscarRoleById } = require("../helpers/rol.helpers");
const { guardarUser } = require("../helpers/user.helpers");

const login = async(req, res) => {
    try {
        const {nombreUsuario, contrasena} = req.body;   
        let user = await validarUsuario("",nombreUsuario);
        validarContrasenaUsuario(user, contrasena);

        await manejarTokenDeRefresco(user); //manejamos casos de token de refresco en el user
        await guardarUser(user)
        
        const colaborador = await buscarColaboradorByIdOrDocumento(user.colaborador);
        const rol = await buscarRoleById(user.rol);
        const userDto = userToUserDto(user, colaborador, rol);
        const tokenAcesso= await generarJWT(user.idUsuario);   //generar el JWT

        return res.json({
            msg: `bienvenido ${user.nombreUsuario} has iniciado sesion correctamente`,
            usuario: userDto,
            tokenAcesso,
        })
        
    } catch (error) {
        return res.status(400).json({
            msg: "Error al iniciar sesion",
            error: error.message
        })
    }
};


//endpoint validacion token cada x minutos dependiendo del front
const validateSessionUser = (req, res) => {
    try {
        const token = obtenerToken(req);
        verificarToken(token, process.env.SECRETORPRIVATEKEY);
        return res.json({
            msg: 'token valido sesion activa'
        })
    } catch (error) {
        return res.status(401).json({
            error: 'token expirado o invalido'
        })
    }
}

module.exports = {
    login,
    validateSessionUser,
}