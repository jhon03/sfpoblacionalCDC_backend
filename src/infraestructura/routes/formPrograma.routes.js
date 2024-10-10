const { Router } = require('express');
const { crearFormularioPrograma, obtenerFormularioPorId, diligenciarFormularioPrograma, obtenerFormulariooPorId, obtenerFormulariosPorNombrePrograma} = require('../controllers/formPrograma.controller');



const router = new Router();



router.post('/:colaboradorId/formularios/crear/', crearFormularioPrograma);

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

//not implement
router.get('/formularios/:nombrePrograma', obtenerFormulariosPorNombrePrograma);

module.exports = router;



