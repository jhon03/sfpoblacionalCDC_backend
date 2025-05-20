const { buscarRoleById } = require("../helpers/rol.helpers");
const { buscarUserByColaborador } = require("../helpers/user.helpers");

// verificación de roles permitidos
const userRolPermitido = (roles = [], accederMiUser = false) => {
    return async (req, res, next) => {
        const { userSession } = req;

        try {
            // obtener el rol del usuario logueado
            const rol = await buscarRoleById(userSession.rol);
            const nombreRolUsuario = rol.nombreRol?.trim().toUpperCase();

            // normalizar todos los roles permitidos para comparar de forma robusta
            const rolesNormalizados = roles.map(r => r.trim().toUpperCase());

            console.log('Rol del usuario logueado:', nombreRolUsuario);
            console.log('Roles permitidos:', rolesNormalizados);

            // verificar si el rol del usuario está entre los permitidos
            if (!rolesNormalizados.includes(nombreRolUsuario)) {
                return res.status(403).json({
                    msg: 'No tienes permiso para realizar esta acción'
                });
            }

            // si el rol es válido, permitir el acceso
            next();
        } catch (error) {
            return res.status(400).json({
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
