const { Router } = require('express');
const { listColaboradores, registrarColaborador, eliminarColaborador, activarColaborador, buscarColaboradorById } = require('../controllers/colaborador.controller');
const { validateCamposPermitidos } = require('../middlewares/validarCampos.middlewares');
const { checkCamposColaborador } = require('../helpers/validarCamposCheck.helpers');
const { validarCampos } = require('../middlewares/validarErrores.middlewares');
const { validarTipoIdentificacion, validarColaborador } = require('../middlewares/validarModelos.middleware');

const router = new Router;

const camposPermitidosColaborador = [
    'tipoIdentificacion',
    'numeroIdentificacion',
    'nombreColaborador',
    'edadColaborador',
]

router.get('/listColaboradores', listColaboradores);

router.post('/crear', [
    validateCamposPermitidos(camposPermitidosColaborador),
    checkCamposColaborador,
    validarCampos,
    validarTipoIdentificacion,
], registrarColaborador);

router.delete('/eliminar/:idColaborador', [
    validarColaborador
], eliminarColaborador);

router.get('/activar/:idColaborador', [
    validarColaborador
], activarColaborador);

router.get('/findById/:idColaborador', [
    validarColaborador
], buscarColaboradorById);

module.exports = router;