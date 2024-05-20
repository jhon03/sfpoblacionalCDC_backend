const {Router} = require('express');
const { obtenerPrograma } = require('../middlewares/obtenerModelos.middleware');
const { validarCamposFormatoPrograma } = require('../middlewares/validarCampos.middlewares');
const { registrarPersona } = require('../controllers/persona.controller');
const router = new Router();

router.post('/registro/:idPrograma', [
    obtenerPrograma(validar=true),
    validarCamposFormatoPrograma,
], registrarPersona)





module.exports = router;