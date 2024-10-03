const { buscarRoleById } = require("../helpers/rol.helpers");
const { buscarUserByColaborador } = require("../helpers/user.helpers");

const userRolPermitido = (roles = [], accederMiUser = false) => {
    return async (req, res, next) => {
        const { userSession } = req;
        const { colaborador } = req.body || {};

        try {

            const rol = await buscarRoleById(userSession.rol);
            

            if (!roles.includes(rol.nombreRol)) {
                return res.status(403).json({
                    msg: 'No tienes permiso para realizar esta acción'
                });
            }

            if (!accederMiUser && colaborador && colaborador !== userSession.colaborador) {
                return res.status(403).json({
                    msg: 'No puedes realizar esta acción para otro colaborador'
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                msg: 'Error al verificar rol',
                error: error.message
            });
        }
    };
};

const noDeletedUserDependRol = (roles = []) => {
    return async (req, res, next) => {
        const { colaborador } = req;

        try {
            const user = await buscarUserByColaborador(colaborador?.idColaborador);
            const rol = await buscarRoleById(user.rol);

            if (!roles.includes(rol.nombreRol)) {
                return res.status(403).json({
                    msg: 'No puedes eliminar al administrador de la app'
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                msg: 'Error al validar el colaborador a eliminar',
                error: error.message
            });
        }
    };
};

module.exports = {
    userRolPermitido,
    noDeletedUserDependRol
};
