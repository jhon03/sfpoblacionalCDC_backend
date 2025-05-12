
const { Router } = require('express');
const { validarJWT } = require('../middlewares/jwt.middleware');

const { crearRegistroNecesidad, obtenerRegistrosNecesidad, actualizarRegistroNecesidad, eliminarRegistro

} = require("../controllers/registroNecesidad.controller");
const { userRolPermitido } = require('../middlewares/auth.middleware')
const router = Router();

const rolesPermitidos = [
"SUPERUSER",
 "DIRECTORA ",
" PROFESIONAL DE PROYECTOS"

]
router.post('/registroNecesidad', [
    validarJWT,
    userRolPermitido(['SUPERUSER', 'DIRECTORA '])
], crearRegistroNecesidad);

router.get('/obtenerNecesidades',[
    validarJWT,
    userRolPermitido(['SUPERUSER', 'DIRECTORA ',' PROFESIONAL DE PROYECTOS'])
], obtenerRegistrosNecesidad);

router.put('/actualizarRegistroNecesidad/:id',[
    validarJWT,
    userRolPermitido(['SUPERUSER', 'DIRECTORA '])
], actualizarRegistroNecesidad);
router.delete('/eliminarRegistro/:id',[
    validarJWT,
    userRolPermitido(['SUPERUSER','DIRECTORA '])
], eliminarRegistro)

module.exports = router;
