const { uploadFile, getFilesInFolder, createLinkShared, createFolder, requestNewToken } = require('../controllers/onedrive.controller');
const { getTokenRefreshed } = require('../helpers/axiosOnedrive.helpers');
const {authenticate} = require('../middlewares/microsoft.middleware');
const {Router} = require('express');

const router = new Router();

router.get('/getFiles', getFilesInFolder);
router.get('/createLinkShared/:itemId', createLinkShared);
router.post('/upload', uploadFile);
router.post('/createFolder/:folderName', createFolder);

router.get('/getNewToken', requestNewToken);


module.exports = router;

