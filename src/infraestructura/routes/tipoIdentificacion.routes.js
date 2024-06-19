const { Router } = require('express');
const { crearIdentificacion, obtenerIdentificaciones, actualizarTipoIdentificacion, desactivarTipoIdentificacion, activarIdentificacion } = require('../controllers/tipoIdentificacion.controller');
const { validateCamposPermitidos } = require('../middlewares/validarCampos.middlewares');
const { checkCamposTipoIdentificacion } = require('../helpers/validarCamposCheck.helpers');
const { validarCampos } = require('../middlewares/validarErrores.middlewares');
const { obtenerTipoIdentificacion } = require('../middlewares/obtenerModelos.middleware');


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
    obtenerTipoIdentificacion(validar=true),
    validateCamposPermitidos(camposPermitidosTipoIdentificacion),
    checkCamposTipoIdentificacion,
    validarCampos
], actualizarTipoIdentificacion);

router.delete('/desactivar/:idIdentificacion', [
    obtenerTipoIdentificacion(validar=true),
], desactivarTipoIdentificacion)

router.get('/activar/:idIdentificacion', [
    obtenerTipoIdentificacion(),
], activarIdentificacion)

router.get('/listaIdentificaciones', obtenerIdentificaciones);

module.exports = router;