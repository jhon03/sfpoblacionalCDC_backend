const { Router } = require('express');
const { listColaboradores, registrarColaborador } = require('../controllers/colaborador.controller');
const { validateCamposPermitidos } = require('../middlewares/validarCampos.middlewares');
const { checkCamposColaborador } = require('../helpers/validarCamposCheck.helpers');
const { validarCampos } = require('../middlewares/validarErrores.middlewares');
const { validarTipoIdentificacion } = require('../middlewares/validarModelos.middleware');

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

module.exports = router;