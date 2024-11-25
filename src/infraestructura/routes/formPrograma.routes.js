const { Router } = require('express');
const { crearFormularioPrograma, obtenerFormularioPorId, diligenciarFormularioPrograma, obtenerFormulariooPorId, buscarFormulariosPorNombrePrograma, diligenciarFormulario} = require('../controllers/formPrograma.controller');
const { validarJWT } = require('../middlewares/jwt.middleware');
const { userRolPermitido } = require('../middlewares/auth.middleware')


const router = new Router();

const rolesPermitidos = [
    "SUPERUSER",
    "ADMINISTRADOR",
    " PROFESIONAL DE PROYECTOS",
    "DIRECTORA ",
    " LIDER DE PROYETOS "
]

const soloLiderProyectos = userRolPermitido
([' LIDER DE PROYETOS ']);


router.post('/:colaboradorId/formularios/crear/', [
    validarJWT,
    userRolPermitido(['DIRECTORA '])

],crearFormularioPrograma);

//ruta para obtener un formulario por id programa y id formulario.
router.get('/:idPrograma/formularios/:idFormulario', obtenerFormularioPorId);

router.post('/formularios/:colaboradorId/:idFormulario/diligenciar',
//validarJWT, //valida el token jwt
//userRolPermitido(['SUPERUSER'], true),
//validateCamposPermitidos(camposPermitidos),
//obtenerColaborador(validar = true),
//checkCamposPrograma,
//validarCampos,
diligenciarFormularioPrograma);

router.get('/formularios/:idFormulario', obtenerFormulariooPorId);

//buscar por nombre del programa
router.get('/buscar', buscarFormulariosPorNombrePrograma);

//ruta para diligeniar formulario por programa
router.post('/diligenciar', [

    validarJWT, //valida el token jwt
    userRolPermitido(rolesPermitidos),
    soloLiderProyectos
    
], diligenciarFormulario);



module.exports = router;



