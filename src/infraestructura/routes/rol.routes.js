const { Router } = require('express');
const { findRoles, findRolById, crearRol, actualizarRol, activarRol, desactivarRol, findRolsNormal } = require('../controllers/rol.controllers');
const { obtenerRol } = require('../middlewares/obtenerModelos.middleware');
const { validateCamposPermitidos } = require('../middlewares/validarCampos.middlewares');
const { checkCamposRol } = require('../helpers/validarCamposCheck.helpers');
const { validarCampos } = require('../middlewares/validarErrores.middlewares');
const { validarJWT } = require('../middlewares/jwt.middleware');
const { userRolPermitido } = require('../middlewares/auth.middleware');

const router = new Router();

const camposPermitidosRol = [
    'nombreRol',
    'descripcion'
]

const rolesPermitidos = [
    "ADMINISTRADOR",
    "SUPERUSER"
]
const soloAdministrador = userRolPermitido(['SUPERUSER']);

router.get('/listRols', [
    validarJWT,
    userRolPermitido(rolesPermitidos),
    soloAdministrador,
], findRoles);

router.get('/findRolById/:idRol', [
    obtenerRol(validar=true),
    userRolPermitido(rolesPermitidos),
    soloAdministrador
], findRolById);

router.post('/crear', [
    validarJWT,
    userRolPermitido(rolesPermitidos),
    soloAdministrador,
    validateCamposPermitidos(camposPermitidosRol),
    checkCamposRol,
    validarCampos
], crearRol);

router.put('/actualizar/:idRol', [
    obtenerRol(validar=true),
    validateCamposPermitidos(camposPermitidosRol),
    checkCamposRol,
    validarCampos,
    userRolPermitido(rolesPermitidos),
    soloAdministrador
], actualizarRol);

router.get('/activar/:idRol', [
    validarJWT,
    userRolPermitido(rolesPermitidos),
    soloAdministrador,
    obtenerRol(),
], activarRol);

router.delete('/desactivar/:idRol', [
    validarJWT,
    userRolPermitido(rolesPermitidos),
    soloAdministrador,
    obtenerRol(),
], desactivarRol);

router.get('/findRols', [
    validarJWT,
    userRolPermitido(rolesPermitidos),
    soloAdministrador
], findRolsNormal);

module.exports = router;