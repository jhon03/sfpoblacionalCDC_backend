const {Router} = require('express');
const { findUsers, findUserById, activarUser } = require('../controllers/user.controllers');
const { obtenerUser } = require('../middlewares/obtenerModelos.middleware');
const { desactivarRol } = require('../controllers/rol.controllers');
const router = new Router();

router.get('/listUsers', findUsers);

router.get('/findById/:idUser', [
    obtenerUser(validar= true),
], findUserById);

router.get('/:idUser/activar', [
    obtenerUser(),
], activarUser);

router.delete('/:idUser/desactivar', [
    obtenerUser()
], desactivarRol);

module.exports = router;