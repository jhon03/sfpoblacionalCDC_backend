const {Router} = require('express');
const { findUsers, findUserById, activarUser, updateUser } = require('../controllers/user.controllers');
const { obtenerUser } = require('../middlewares/obtenerModelos.middleware');
const { desactivarRol } = require('../controllers/rol.controllers');
const { userRolPermitido } = require('../middlewares/auth.middleware');
const { validarJWT } = require('../middlewares/jwt.middleware');

const router = new Router();

const rolesPermitidos = [
    "SUPERUSER",
    "ADMINISTRADOR"
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

router.delete('/desactivar/:idUser', [
    obtenerUser(validar=true)
], desactivarRol);

router.put('/actualizar/:idUser', [
    validarJWT,
    obtenerUser(validar=true),
    userRolPermitido(rolesPermitidos)
], updateUser);

module.exports = router;