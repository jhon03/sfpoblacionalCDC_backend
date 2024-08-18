const {Router} = require('express');
const { login, registro, validateSessionUser } = require('../controllers/auth.controller');
const { checkCamposLogin } = require('../helpers/validarCamposCheck.helpers');
const { validarCampos } = require('../middlewares/validarErrores.middlewares');
const { validateCamposPermitidos } = require('../middlewares/validarCampos.middlewares');
const { validarJWT } = require('../middlewares/jwt.middleware');
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

router.get('/validateSession', [
    validarJWT
], validateSessionUser);


module.exports = router;