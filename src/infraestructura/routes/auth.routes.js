const {Router} = require('express');
const { login, registro } = require('../controllers/auth.controller');
const { checkCamposLogin } = require('../helpers/validarCamposCheck.helpers');
const { validarCampos } = require('../middlewares/validarErrores.middlewares');
const { validateCamposPermitidos } = require('../middlewares/validarCampos.middlewares');
const router = new Router();

const camposPermitidos = [
    "nombreUsuario",
    "contrasena"
]

router.post('/login', [
    validateCamposPermitidos(camposPermitidos),
    checkCamposLogin,
    validarCampos
], login);


module.exports = router;