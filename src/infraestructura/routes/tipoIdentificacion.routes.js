const { Router } = require('express');
const { crearIdentificacion, obtenerIdentificaciones, actualizarTipoIdentificacion, desactivarTipoIdentificacion, activarIdentificacion, obtenerIdentificacionesNormal } = require('../controllers/tipoIdentificacion.controller');
const { validateCamposPermitidos } = require('../middlewares/validarCampos.middlewares');
const { checkCamposTipoIdentificacion } = require('../helpers/validarCamposCheck.helpers');
const { validarCampos } = require('../middlewares/validarErrores.middlewares');
const { obtenerTipoIdentificacion } = require('../middlewares/obtenerModelos.middleware');
const { validarJWT } = require('../middlewares/jwt.middleware');
const { userRolPermitido } = require('../middlewares/auth.middleware');


const camposPermitidosTipoIdentificacion = [
    'nombreIdentificacion',
]

const rolesPermitidos = [
    "ADMINISTRADOR",
    "SUPERUSER"
]

const router = new Router();

router.post('/crear', [
    validarJWT,
    userRolPermitido(rolesPermitidos),
    validateCamposPermitidos(camposPermitidosTipoIdentificacion),
    checkCamposTipoIdentificacion,
    validarCampos
], crearIdentificacion),

router.put('/actualizar/:idIdentificacion', [
    validarJWT,
    userRolPermitido(rolesPermitidos),
    obtenerTipoIdentificacion(validar=true),
    validateCamposPermitidos(camposPermitidosTipoIdentificacion),
    checkCamposTipoIdentificacion,
    validarCampos
], actualizarTipoIdentificacion);

router.delete('/desactivar/:idIdentificacion', [
    validarJWT,
    userRolPermitido(rolesPermitidos),
    obtenerTipoIdentificacion(validar=true),
], desactivarTipoIdentificacion)

router.get('/activar/:idIdentificacion', [
    validarJWT,
    userRolPermitido(rolesPermitidos),
    obtenerTipoIdentificacion(),
], activarIdentificacion)

router.get('/listaIdentificaciones', [
    validarJWT,
    userRolPermitido(rolesPermitidos)
], obtenerIdentificaciones);

router.get('/getIdentificaciones', [
    validarJWT,
    userRolPermitido(rolesPermitidos)
], obtenerIdentificacionesNormal);



module.exports = router;