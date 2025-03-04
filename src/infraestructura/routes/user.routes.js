const {Router} = require('express');
const { findUsers, findUserById, activarUser, updateUser, obtenerUserActual, desactivarUser } = require('../controllers/user.controllers');
const { obtenerUser } = require('../middlewares/obtenerModelos.middleware');
const { desactivarRol } = require('../controllers/rol.controllers');
const { userRolPermitido, noDeletedUserDependRol } = require('../middlewares/auth.middleware');
const { validarJWT } = require('../middlewares/jwt.middleware');

const router = new Router();

const rolesPermitidos = [
    "SUPERUSER",
    "ADMINISTRADOR"
]

const rolesNoDeleted = [
    "SUPERUSER",
    "ADMINISTRADOR",
]

router.get('/listUsers', [
    validarJWT,
    userRolPermitido(rolesPermitidos),
], findUsers);

router.get('/findById/:idUser', [
    obtenerUser(validar= true),
], findUserById);

router.get('/activar/:idUser', [
    obtenerUser(),
], activarUser);

router.get('/getCurrentUser', [
    validarJWT
], obtenerUserActual)

router.delete('/desactivar/:idUser', [
    validarJWT,
    userRolPermitido(rolesPermitidos),
    noDeletedUserDependRol(rolesNoDeleted),
    obtenerUser(validar=true)
], desactivarUser);

router.put('/actualizar/:idUser', [
    validarJWT,
    obtenerUser(validar=true),
    userRolPermitido(rolesPermitidos)
], updateUser);

router.get('activar/:idUser', [
    validarJWT,
    obtenerUser(validar=true),
    userRolPermitido(rolesPermitidos),
], activarUser)

module.exports = router;