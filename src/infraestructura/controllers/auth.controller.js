const { userToUserDto } = require("../../aplicacion/mappers/user.mapper");
const { validarUsuario, validarContrasenaUsuario } = require("../helpers/auth.helpers");
const { buscarColaboradorByIdOrDocumento } = require("../helpers/colaborador.helpers");
const { generarJWT, generarJWTRefresh } = require("../helpers/jwt.helpers");
const { buscarRoleById } = require("../helpers/rol.helpers");
const { guardarUser } = require("../helpers/user.helpers");

const login = async(req, res) => {
    try {
        const {nombreUsuario, contrasena} = req.body;      
        let user = await validarUsuario("",nombreUsuario);
        validarContrasenaUsuario(user, contrasena);
        
        const refreshToken = await generarJWTRefresh(user.idUsuario);  //creamos y asignamos el token de refresco al user 
        user.refreshToken = refreshToken;
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

//endpoint para renovar token de acesso de usuario
const renovarToken = async(req, res) =>{
    try {
        let { userSession } = req;
        if(!refreshToken || refreshToken === null){
            throw new Error('No posees un token de refreco')
        }
        const nuevoTokenAcesso = await generarJWT(usuario.id);
        return res.json({
            msg: 'token renovado con exito',
            token: nuevoTokenAcesso,
        })
    } catch (error) {
        return res.status(400).json({
            msg: error.message
        })
    }
}

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