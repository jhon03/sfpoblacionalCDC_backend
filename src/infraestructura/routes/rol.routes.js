const { Router } = require('express');
const { findRoles, FindRolById, crearRol, actualizarRol, activarRol, desactivarRol } = require('../controllers/rol.controllers');
const { obtenerRol } = require('../middlewares/obtenerModelos.middleware');
const { validateCamposPermitidos } = require('../middlewares/validarCampos.middlewares');
const { checkCamposRol } = require('../helpers/validarCamposCheck.helpers');
const { validarCampos } = require('../middlewares/validarErrores.middlewares');

const router = new Router();

const camposPermitidosRol = [
    'nombreRol',
    'descripcion'
]

router.get('/listRols', findRoles);

router.get('/findRolById/:idRol', [
    obtenerRol(validar=true),
], FindRolById);

router.post('/crear', [
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
    obtenerRol(),
], activarRol);

router.delete('/desactivar/:idRol', [
    obtenerRol(),
], desactivarRol);

module.exports = router;