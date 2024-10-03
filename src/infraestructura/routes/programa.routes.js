
const { Router } = require('express');
const { crearPrograma, obtenerListaProgramas, actualizarPrograma, desactivarPrograma, activarPrograma, confirmaPrograma, obtenerProgramasEnEspera, crearFormatoPrograma } = require('../controllers/programa.controllers');
const { obtenerColaborador, obtenerPrograma } = require('../middlewares/obtenerModelos.middleware');
const { validateCamposPermitidos } = require('../middlewares/validarCampos.middlewares');
const { checkCamposPrograma } = require('../helpers/validarCamposCheck.helpers');
const { validarCampos } = require('../middlewares/validarErrores.middlewares');
const { obtenerProgramaConfirmacion } = require('../helpers/programa.helpers');
const { validarJWT } = require('../middlewares/jwt.middleware');
const { userRolPermitido } = require('../middlewares/auth.middleware');
const router = new Router();

const camposPermitidos = [
    "nombrePrograma",
    "informacion",
]

const rolesPermitidos = [
    "SUPERUSER",
    "ADMINISTRADOR",
    "PROFESIONAL DE PROYECTOS",
]

router.put('/actualizar/:idPrograma', [
    validarJWT,
    obtenerPrograma(validar=true),
    validateCamposPermitidos(camposPermitidos),
    checkCamposPrograma,
    validarCampos,
], actualizarPrograma);

router.post('/:idColaborador/crearPrograma', [
     validarJWT,
    //userRolPermitido(['PROFESIONAL DE PROYECTOS'], true),
    validateCamposPermitidos(camposPermitidos),
    obtenerColaborador(validar = true),
    checkCamposPrograma,
    validarCampos,
], crearPrograma);



router.get('/desactivar/:idPrograma', [
    validarJWT,
    obtenerPrograma(validar = true),
], desactivarPrograma);

router.get('/activar/:idPrograma', [
    validarJWT,
    obtenerPrograma(),
], activarPrograma);

router.get('/obtenerProgramas', 
    validarJWT,
    obtenerListaProgramas)

router.get('/obtenerProgramasConfirmacion', 
    validarJWT,
    obtenerProgramasEnEspera);

router.post('/confirmar/:idPrograma/colAsignado/:idColaborador', [
    validarJWT,
    userRolPermitido(rolesPermitidos),
    obtenerPrograma(validar=true),
    obtenerColaborador(validar=true),
], confirmaPrograma);

//endpoint antiguo inactivo
// router.post('/crearFormato/:idPrograma', [
//     validarJWT,
//     userRolPermitido(rolesPermitidos),
//     obtenerPrograma(validar=true)
// ], crearFormatoPrograma);


module.exports = router;