const { uploadFile, getFilesInFolder, createLinkShared, createFolder, requestNewToken, getInformationFile, loginMicrosoft, obtenerTokenMicrosoft, deleteFile } = require('../controllers/onedrive.controller');
const { getTokenRefreshed } = require('../helpers/axiosOnedrive.helpers');
//const { rolesAutorizados, allRols } = require('../helpers/rol.helpers');
const { rolesAutorizados, allRols} = require('../helpers/rol.helpers');
const { userRolPermitido } = require('../middlewares/auth.middleware');
const { validarJWT } = require('../middlewares/jwt.middleware');
const {authenticate} = require('../middlewares/microsoft.middleware');
const {Router} = require('express');

const router = new Router();

// router.get('/login', loginMicrosoft);

// router.get('/redirect', obtenerTokenMicrosoft)

// en este endpoint se permiten todos los roles, obtener archivos de una carpeta
router.get('/getFiles',[
    validarJWT,
    userRolPermitido(allRols),
    authenticate,
], getFilesInFolder);


//obtener informacion del archivo
router.get('/getFileInfo/:itemId',[
    validarJWT,
    userRolPermitido([
        rolesAutorizados.SUPERUSER, rolesAutorizados.ADMINISTRADOR, rolesAutorizados.DIRECTOR
    ]),
    authenticate,
], getInformationFile),

router.get('/createLinkShared/:itemId', [
    validarJWT,
    userRolPermitido([
        rolesAutorizados.SUPERUSER, rolesAutorizados.ADMINISTRADOR, rolesAutorizados.DIRECTOR
    ]),
    authenticate
], createLinkShared);

router.post('/upload', [
    validarJWT,
    userRolPermitido(allRols),
    authenticate
], uploadFile);

router.post('/createFolder/:folderName', [
    validarJWT,
    userRolPermitido([
        rolesAutorizados.ADMINISTRADOR, rolesAutorizados.DIRECTOR, rolesAutorizados.SUPERUSER
    ]),
    authenticate
], createFolder);

//endpoint eliminar achivo y enviarlo a la papelera
router.delete('/deleteFile/:itemId', [
    validarJWT,
    userRolPermitido([
        rolesAutorizados.ADMINISTRADOR, rolesAutorizados.DIRECTOR, rolesAutorizados.SUPERUSER
    ]),
    authenticate
], deleteFile)

//router.get('/getNewToken', requestNewToken);


module.exports = router;