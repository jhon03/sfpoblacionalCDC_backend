const { Router } = require('express');
const { crearFormularioPrograma, obtenerFormularioPorId, diligenciarFormularioPrograma, obtenerFormulariooPorId, obtenerFormulariosPorNombrePrograma} = require('../controllers/formPrograma.controller')
const router = new Router();

router.post('/:colaboradorId/formularios/crear/', crearFormularioPrograma);

router.get('/:idPrograma/formularios/:idFormulario', obtenerFormularioPorId);

router.post('/formularios/:idFormulario/diligenciar', diligenciarFormularioPrograma);
//router.get('/formularios/:idFormulario', obtenerFormulariooPorId); 

//not implement
router.get('/formularios/:nombrePrograma', obtenerFormulariosPorNombrePrograma);

module.exports = router;



