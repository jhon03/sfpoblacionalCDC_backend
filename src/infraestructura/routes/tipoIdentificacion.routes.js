const { Router } = require('express');
const { crearIdentificacion, obtenerIdentificaciones } = require('../controllers/tipoIdentificacion.controller');
const router = new Router();

router.post('/crear', crearIdentificacion),

router.get('/listaIdentificaciones', obtenerIdentificaciones);

module.exports = router;