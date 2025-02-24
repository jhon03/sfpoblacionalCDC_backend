const {Router} = require('express');
const { loginMicrosoft, obtenerTokenMicrosoft } = require('../controllers/onedrive.controller');

const router = new Router();

router.get('/login', loginMicrosoft);

router.get('/redirect', obtenerTokenMicrosoft);

module.exports = router;