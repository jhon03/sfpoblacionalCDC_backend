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

router.get('/listRols', [
    validarJWT,
    userRolPermitido(rolesPermitidos),
], findRoles);

router.get('/findRolById/:idRol', [
    obtenerRol(validar=true),
    userRolPermitido(rolesPermitidos),
], findRolById);

router.post('/crear', [
    validarJWT,
    userRolPermitido(rolesPermitidos),
    validateCamposPermitidos(camposPermitidosRol),
    checkCamposRol,
    validarCampos
], crearRol);

router.put('/actualizar/:idRol', [
    obtenerRol(validar=true),
    validateCamposPermitidos(camposPermitidosRol),
    checkCamposRol,
    validarCampos
], actualizarRol);

router.get('/activar/:idRol', [
    validarJWT,
    userRolPermitido(rolesPermitidos),
    obtenerRol(),
], activarRol);

router.delete('/desactivar/:idRol', [
    validarJWT,
    userRolPermitido(rolesPermitidos),
    obtenerRol(),
], desactivarRol);

router.get('/findRols', [
    validarJWT,
    userRolPermitido(rolesPermitidos),
], findRolsNormal);

module.exports = router;