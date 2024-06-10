
const { Router } = require('express');
const { crearPrograma, obtenerListaProgramas, actualizarPrograma, desactivarPrograma, activarPrograma, confirmaPrograma, obtenerProgramasEnEspera } = require('../controllers/programa.controllers');
const { obtenerColaborador, obtenerPrograma } = require('../middlewares/obtenerModelos.middleware');
const { validateCamposPermitidos } = require('../middlewares/validarCampos.middlewares');
const { checkCamposPrograma } = require('../helpers/validarCamposCheck.helpers');
const { validarCampos } = require('../middlewares/validarErrores.middlewares');
const { obtenerProgramaConfirmacion } = require('../helpers/programa.helpers');
const router = new Router();

const camposPermitidos = [
    "nombrePrograma",
    "formato",
]

router.put('/actualizar/:idPrograma', [
    obtenerPrograma(validar=true),
    validateCamposPermitidos(camposPermitidos),
    checkCamposPrograma,
    validarCampos,
], actualizarPrograma);

router.post('/:idColaborador/crearPrograma', [
    validateCamposPermitidos(camposPermitidos),
    obtenerColaborador(validar = true),
    checkCamposPrograma,
    validarCampos,
], crearPrograma);

router.get('/desactivar/:idPrograma', [
    obtenerPrograma(validar = true),
], desactivarPrograma);

router.get('/activar/:idPrograma', [
    obtenerPrograma(),
], activarPrograma);

router.get('/obtenerProgramas', obtenerListaProgramas)

router.get('/obtenerProgramasConfirmacion', obtenerProgramasEnEspera);

router.get('/confirmar/:idPrograma/colAsignado/:idColaborador', [
    obtenerPrograma(validar=true),
    obtenerColaborador(validar=true)
], confirmaPrograma);


module.exports = router;