//const express = require('express');
const { Router } = require('express');

const { registrarAsistencia, contarAsistentesPorActividad } = require('../controllers/asistencia.controller');
const { validarJWT } = require('../middlewares/jwt.middleware');

const { userRolPermitido } = require('../middlewares/auth.middleware');
const { rolesAutorizados, allRols} = require('../helpers/rol.helpers');

const router = new Router();
const rolesPermitidos = [
    "SUPERUSER",
    "DIRECTORA ",
    " LIDER DE PROYETOS "
]
router.post('/registrarasistencias', [
validarJWT,
userRolPermitido([' LIDER DE PROYETOS ']),
//userRolPermitido(allRols),
],registrarAsistencia);

router.get('/asistencias/actividad/:nombreActividad', [

], contarAsistentesPorActividad);

module.exports = router;
