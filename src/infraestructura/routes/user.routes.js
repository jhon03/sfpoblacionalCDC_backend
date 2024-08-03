const {Router} = require('express');
const { findUsers, findUserById, activarUser, updateUser } = require('../controllers/user.controllers');
const { obtenerUser } = require('../middlewares/obtenerModelos.middleware');
const { desactivarRol } = require('../controllers/rol.controllers');
const router = new Router();

router.get('/listUsers', findUsers);

router.get('/findById/:idUser', [
    obtenerUser(validar= true),
], findUserById);

router.get('/activar/:idUser', [
    obtenerUser(),
], activarUser);

router.delete('/desactivar/:idUser', [
    obtenerUser()
], desactivarRol);

router.put('/actualizar/:idUser', [
    obtenerUser()
], updateUser);

module.exports = router;