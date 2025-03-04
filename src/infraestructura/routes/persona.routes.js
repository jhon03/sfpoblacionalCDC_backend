const {Router} = require('express');
const { obtenerPrograma, obtenerPersona } = require('../middlewares/obtenerModelos.middleware');
const { validarCamposFormatoPrograma } = require('../middlewares/validarCampos.middlewares');
const { registrarPersona, obtenerListaPersonas, obtenerPersonaById, actualizarPersona, activarPersona, desactivarPersona } = require('../controllers/persona.controller');
const { validarJWT } = require('../middlewares/jwt.middleware');
const router = new Router();

router.post('/registro/:idPrograma', [
    validarJWT,
    obtenerPrograma(validar=true),
    validarCamposFormatoPrograma,
], registrarPersona);

router.put('/actualizar/:idPersona',[
    validarJWT,
    obtenerPersona(validar=true),
    validarCamposFormatoPrograma,
], actualizarPersona);

router.get('/obtenerRegistros', [
    validarJWT,
], obtenerListaPersonas);

router.get('/:idPersona', [
    validarJWT,
    obtenerPersona(validar=true)
], obtenerPersonaById);

router.delete('/desactivar/:idPersona', [
    validarJWT,
    obtenerPersona(validar=true)
], desactivarPersona);

router.get('/activar/:idPersona', [
    validarJWT,
    obtenerPersona(),
], activarPersona);


module.exports = router;