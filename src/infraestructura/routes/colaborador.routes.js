const { Router } = require('express');
const { listColaboradores, registrarColaborador, desactivarColaborador, activarColaborador, buscarColaboradorById, registrarColaboradorTransactional, actualizarColaborador } = require('../controllers/colaborador.controller');
const { validateCamposPermitidos } = require('../middlewares/validarCampos.middlewares');
const { checkCamposColaborador, checkCamposUser } = require('../helpers/validarCamposCheck.helpers');
const { validarCampos } = require('../middlewares/validarErrores.middlewares');
const { obtenerTipoIdentificacion, obtenerColaborador, obtenerUsuarioByUserName, obtenerRol } = require('../middlewares/obtenerModelos.middleware');
const { noDeletedUserDependRol, userRolPermitido } = require('../middlewares/auth.middleware');
const { validarJWT } = require('../middlewares/jwt.middleware');

const router = new Router;

const rolesPermitidos = [
    "SUPERUSER",
    "ADMINISTRADOR"
]

const camposPermitidosColaborador = [
    'tipoIdentificacion',
    'numeroIdentificacion',
    'nombreColaborador',
    'nombreUsuario',
    'contrasena',
    'rol'
]

router.get('/listColaboradores', [
    validarJWT
], listColaboradores);

router.post('/crear', [
    validarJWT,
    userRolPermitido(rolesPermitidos),
    validateCamposPermitidos(camposPermitidosColaborador),
    checkCamposColaborador,
    checkCamposUser,
    validarCampos,
    obtenerTipoIdentificacion(validar= true),
    obtenerUsuarioByUserName(validar=true),
    obtenerRol(true),
], registrarColaborador);

router.delete('/desactivar/:idColaborador', [
    obtenerColaborador(validar= true),
    noDeletedUserDependRol,
], desactivarColaborador);

router.get('/activar/:idColaborador', [
    obtenerColaborador(),
], activarColaborador);

router.get('/findById/:idColaborador', [
    obtenerColaborador(validar = true),
], buscarColaboradorById);

router.put('/actualizar/:idColaborador', [
    validateCamposPermitidos(camposPermitidosColaborador),
    obtenerColaborador(validar=true)
], actualizarColaborador);

module.exports = router;