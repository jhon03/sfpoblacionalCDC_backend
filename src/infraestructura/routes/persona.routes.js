const {Router} = require('express');
const { obtenerPrograma, obtenerPersona } = require('../middlewares/obtenerModelos.middleware');
const { validarCamposFormatoPrograma } = require('../middlewares/validarCampos.middlewares');
const { registrarPersona, obtenerListaPersonas, obtenerPersonaById, actualizarPersona, activarPersona, desactivarPersona } = require('../controllers/persona.controller');
const router = new Router();

router.post('/registro/:idPrograma', [
    obtenerPrograma(validar=true),
    validarCamposFormatoPrograma,
], registrarPersona);

router.put('/actualizar/:idPersona',[
    obtenerPersona(validar=true),
    validarCamposFormatoPrograma,
], actualizarPersona);

router.get('/obtenerRegistros', obtenerListaPersonas);

router.get('/:idPersona', [
    obtenerPersona(validar=true)
], obtenerPersonaById);

router.delete('/desactivar/:idPersona', [
    obtenerPersona()
], desactivarPersona);

router.get('/activar/:idPersona', [
    obtenerPersona(),
], activarPersona);





module.exports = router;