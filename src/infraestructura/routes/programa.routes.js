
const { Router } = require('express');
const { crearPrograma } = require('../controllers/programa.controllers');
const { validarColaborador } = require('../middlewares/validarModelos.middleware');
const { validateCamposPermitidos } = require('../middlewares/validarCampos.middlewares');
const { checkCamposPrograma } = require('../helpers/validarCamposCheck.helpers');
const { validarCampos } = require('../middlewares/validarErrores.middlewares');
const router = new Router();

const camposPermitidos = [
    "nombrePrograma",
    "formato",
]

router.post('/:idColaborador/crearPrograma', [
    validateCamposPermitidos(camposPermitidos),
    validarColaborador,
    checkCamposPrograma,
    validarCampos,
], crearPrograma);


module.exports = router;