const { Router } = require('express');
const { listColaboradores, registrarColaborador, desactivarColaborador, activarColaborador, buscarColaboradorById, registrarColaboradorTransactional, actualizarColaborador } = require('../controllers/colaborador.controller');
const { validateCamposPermitidos } = require('../middlewares/validarCampos.middlewares');
const { checkCamposColaborador, checkCamposUser } = require('../helpers/validarCamposCheck.helpers');
const { validarCampos } = require('../middlewares/validarErrores.middlewares');
const { obtenerTipoIdentificacion, obtenerColaborador, obtenerUsuarioByUserName } = require('../middlewares/obtenerModelos.middleware');

const router = new Router;

const camposPermitidosColaborador = [
    'tipoIdentificacion',
    'numeroIdentificacion',
    'nombreColaborador',
    'nombreUsuario',
    'contrasena'
]

router.get('/listColaboradores', listColaboradores);

router.post('/crear', [
    validateCamposPermitidos(camposPermitidosColaborador),
    checkCamposColaborador,
    checkCamposUser,
    validarCampos,
    obtenerTipoIdentificacion(validar= true),
    obtenerUsuarioByUserName(validar=true)
], registrarColaborador);

router.delete('/desactivar/:idColaborador', [
    obtenerColaborador(validar= true),
], desactivarColaborador);

router.get('/activar/:idColaborador', [
    obtenerColaborador(),
], activarColaborador);

router.get('/findById/:idColaborador', [
    obtenerColaborador(validar = true),
], buscarColaboradorById);

router.put('/actualizar/:idColaborador', [
    obtenerColaborador(validar=true)
], actualizarColaborador);

module.exports = router;