const { Router } = require('express');
const { crearFormularioPrograma, obtenerFormularioPorId, obtenerFormulariooPorId, buscarFormulariosPorNombrePrograma, diligenciarFormulario} = require('../controllers/formPrograma.controller');
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

router.post('/:colaboradorId/formularios/crear/', [
    validarJWT,
    userRolPermitido(['DIRECTORA '])

],crearFormularioPrograma);

//ruta para obtener un formulario por id programa y id formulario.
router.get('/:idPrograma/formularios/:idFormulario', obtenerFormularioPorId);


router.get('/formularios/:idFormulario', obtenerFormulariooPorId);

//buscar por nombre del programa
router.get('/buscar', buscarFormulariosPorNombrePrograma);

//ruta para diligeniar formulario
router.post('/diligenciar', [

    validarJWT, //valida el token jwt
   userRolPermitido([' LIDER DE PROYETOS '])


], diligenciarFormulario);



module.exports = router;



