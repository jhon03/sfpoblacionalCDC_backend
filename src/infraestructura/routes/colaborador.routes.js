const { Router } = require('express');
const { listColaboradores, registrarColaborador, desactivarColaborador, activarColaborador, buscarColaboradorById, registrarColaboradorTransactional, actualizarColaborador,
    obtenerColaboradoresConRol } = require('../controllers/colaborador.controller');
const { validateCamposPermitidos } = require('../middlewares/validarCampos.middlewares');
const { checkCamposColaborador, checkCamposUser } = require('../helpers/validarCamposCheck.helpers');
const { validarCampos } = require('../middlewares/validarErrores.middlewares');
const { obtenerTipoIdentificacion, obtenerColaborador, obtenerUsuarioByUserName, obtenerRol } = require('../middlewares/obtenerModelos.middleware');
const { noDeletedUserDependRol, userRolPermitido } = require('../middlewares/auth.middleware');
const { validarJWT } = require('../middlewares/jwt.middleware');
const {buscarColaboradorByOrDocumento} = require('../helpers/colaborador.helpers');
const { buscarColaborador } = require('../controllers/colaborador.controller');
const router = new Router;

const rolesPermitidos = [
    "SUPERUSER",
    "ADMINISTRADOR",
    " PROFESIONAL DE PROYECTOS",
    "DIRECTORA "
]

const soloAdministrador = userRolPermitido(['SUPERUSER']);


const camposPermitidosColaborador = [
    'tipoIdentificacion',
    'numeroIdentificacion',
    'nombreColaborador',
    'nombreUsuario',
    'contrasena',
    'rol',
    'email'
]

router.get('/listColaboradores', [
    validarJWT,
    userRolPermitido(['SUPERUSER',' PROFESIONAL DE PROYECTOS']),
], listColaboradores);

router.post('/crear', [
    validarJWT,
    userRolPermitido(rolesPermitidos),
    soloAdministrador,
    validateCamposPermitidos(camposPermitidosColaborador),
    checkCamposColaborador,
    checkCamposUser,
    validarCampos,
    obtenerTipoIdentificacion(validar= true),
    obtenerUsuarioByUserName(validar=true),
    obtenerRol(true),
], registrarColaborador);

router.get('/findById/:idColaborador', [
    validarJWT,
    userRolPermitido(rolesPermitidos),
    obtenerColaborador(validar = true),
], buscarColaboradorById);

router.get('/listcolaboradoresconroles', [
    validarJWT,
    userRolPermitido(['SUPERUSER','DIRECTORA ']),

],
obtenerColaboradoresConRol);

router.delete('/desactivar/:idColaborador', [
 validarJWT,
obtenerColaborador(validar= true),
userRolPermitido(rolesPermitidos),
soloAdministrador
//noDeletedUserDependRol(rolesPermitidos),
 ], desactivarColaborador);

// router.get('/activar/:idColaborador', [
//     validarJWT,
//     userRolPermitido(rolesPermitidos),
//     obtenerColaborador(),
// ], activarColaborador);



router.put('/actualizar/:idColaborador', [
validarJWT,
userRolPermitido(rolesPermitidos),
soloAdministrador,
validateCamposPermitidos(camposPermitidosColaborador),
obtenerColaborador(validar=true)
], actualizarColaborador);

// Ruta para buscar colaborador por ID o número de identificación
router.get('/buscar', buscarColaborador);

module.exports = router;