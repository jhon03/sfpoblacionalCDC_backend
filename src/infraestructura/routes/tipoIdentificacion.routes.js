const { Router } = require('express');
const { crearIdentificacion, obtenerIdentificaciones, actualizarTipoIdentificacion, eliminarTipoIdentificacion, activarIdentificacion } = require('../controllers/tipoIdentificacion.controller');
const { validateCamposPermitidos } = require('../middlewares/validarCampos.middlewares');
const { checkCamposTipoIdentificacion } = require('../helpers/validarCamposCheck.helpers');
const { validarCampos } = require('../middlewares/validarErrores.middlewares');
const { validarTipoIdentificacion } = require('../middlewares/validarModelos.middleware');

const camposPermitidosTipoIdentificacion = [
    'nombreIdentificacion',
]

const router = new Router();

router.post('/crear', [
    validateCamposPermitidos(camposPermitidosTipoIdentificacion),
    checkCamposTipoIdentificacion,
    validarCampos
], crearIdentificacion),

router.put('/actualizar/:idIdentificacion', [
    validarTipoIdentificacion,
    validateCamposPermitidos(camposPermitidosTipoIdentificacion),
    checkCamposTipoIdentificacion,
    validarCampos
], actualizarTipoIdentificacion);

router.delete('/eliminar/:idIdentificacion', [
    validarTipoIdentificacion,
], eliminarTipoIdentificacion)

router.get('/activar/:idIdentificacion', [
    validarTipoIdentificacion,
], activarIdentificacion)

router.get('/listaIdentificaciones', obtenerIdentificaciones);

module.exports = router;