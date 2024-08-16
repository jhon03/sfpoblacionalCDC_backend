const { buscarRoleById } = require("../helpers/rol.helpers");
const { buscarUserByColaborador } = require("../helpers/user.helpers");


const userRolPermitido = (roles = [], accedertMismoUser=false) => {
    return async(req, res, next) => {
        const {userSession} = req;
        try {
            
            const rol = await buscarRoleById(userSession.rol);
            if(!roles.includes(rol.nombreRol)) {
                return res.status(400).json({
                    msg: 'No tienes permiso para realizar esta acción'
                })
            };
            next();
        } catch (error) {
            return res.status(400).json({
                msg: 'Error al verificar rol',
                error: error.message
            })
        }
    }
};

const noDeletedUserDependRol = (roles=[]) => {
    return async (req, res, next) => {
        const {colaborador} = req;
        try {
            const user = await buscarUserByColaborador(colaborador.idColaborador);
            const rol = await buscarRoleById(user.rol);
            if(!roles.includes(rol.nombreRol)){   
                return res.status(400).json({
                    msg: 'No puedes eliminar al administrador de la app'
                })
            };
            next();
        } catch (error) {
            return res.status(400).json({
                msg: "Error al validar el colaborador a eliminar",
                error: error.message
            })
        }
    }
}

module.exports = {
    userRolPermitido,
    noDeletedUserDependRol
}