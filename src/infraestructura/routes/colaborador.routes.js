const { Router } = require('express');
const { listColaboradores, registrarColaborador, desactivarColaborador, activarColaborador, buscarColaboradorById } = require('../controllers/colaborador.controller');
const { validateCamposPermitidos } = require('../middlewares/validarCampos.middlewares');
const { checkCamposColaborador } = require('../helpers/validarCamposCheck.helpers');
const { validarCampos } = require('../middlewares/validarErrores.middlewares');
const { obtenerTipoIdentificacion, obtenerColaborador } = require('../middlewares/obtenerModelos.middleware');

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
    obtenerTipoIdentificacion(validar= true),
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

module.exports = router;