const { uploadSource, getSource, createSource, getTokenRefreshed, getTokenWithAuthorizationCode, deleteSource } = require("../helpers/axiosOnedrive.helpers");
const { saveToken, createToken, findToken, validarExpiracionToken, updateToken } = require("../helpers/token.helpers");
const { num_random } = require("../helpers/globales.helpers");
const { leerArchivo } = require("../helpers/fileSystem/fs.helpers");

const apiEndpont = process.env.GRAPH_API_ENDPOINT;

const loginMicrosoft = (req, res) => {
    const authUrl = `${process.env.MICROSOFT_LOGIN_URL}/authorize?client_id=${process.env.CLIENT_ID}&scope=files.readwrite offline_access&response_type=code&redirect_uri=${process.env.REDIREC_URI}`
    res.redirect(authUrl);
}

const obtenerTokenMicrosoft = async(req, res) => {
    const code = req.query.code;
    const tokenResponse = await getTokenWithAuthorizationCode(code);
    console.log(tokenResponse);
    const refreshToken = tokenResponse.refresh_token;
    res.send('Autenticación completada. Puedes cerrar esta ventana.');
}


const uploadFile = async (req, res) => {
    const { name: fileName, mimeType, tempFilePath} = req.files.archivo;
    const token = req.token; //tomamos el token de acesso desde la req
    const folderPath = `PRUEBAS_API`;   //folder donde se guardara el archivo
    const filePath = `${num_random()}_${fileName}`;    //nombre del archivo en el onedrive
    try {
        const fileContent = leerArchivo(tempFilePath);
        const url = `${apiEndpont}/me/drive/root:/${folderPath}/${filePath}:/content`;
        const response = await uploadSource(url, fileContent, mimeType, token.accessToken);
        res.status(201).json({
            response: response.data
        });

    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({
            error: error.message
        });
    }
};

//endpoint para obtener los archivos de una carpeta comenzando por la raiz del directorio
const getFilesInFolder = async (req, res) => {
    const {pathFolder} = req.body;
    try {
        const token = req.token;
        const url = `${process.env.GRAPH_API_ENDPOINT}/me/drive/root:/${pathFolder}:/children`
        const response = await getSource(url, token.accessToken);
        res.json({
            msg: 'archivos obtenidos con exito',
            files: response.data
        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
}

const getInformationFile = async(req, res) => {
    const {itemId} = req.params;
    const token = req.token;
    try {
        const url = `${process.env.GRAPH_API_ENDPOINT}/me/drive/items/${itemId}`;
        const response = await getSource(url, token.accessToken);
        res.json({
            msg: 'archivo obtenido con exito',
            file: response.data
        })
    } catch (error) {
        req.status(400).json({
            error: error.message
        })
    }
}

// controlador para crear el link para poder ver el archivo
const createLinkShared = async (req, res) => {
    const {itemId} = req.params;
    const token = req.token;
    try {
        const url = `${process.env.GRAPH_API_ENDPOINT}/me/drive/items/${itemId}/createLink`;
        const body = {
            type: 'view',
            scope: 'anonymous'
        }
        const headers = {
            headers: {
                Authorization: `Bearer ${token.accessToken}`,
                'Content-Type': 'application/json'
            }
        }
        const response = await createSource(url, body, headers);
        console.log(response.data);
        res.status(201).json({
            msg: 'enlace compartido con exito',
            link: response.data.link.webUrl
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const createFolder = async (req, res) => {
    const {folderName} = req.params;
    const token = req.token;
    const pathCarpeta = 'PRUEBAS_API';  //carpeta en la raiz del onedrive( en la que se guarda el folder)
    const url = `${process.env.GRAPH_API_ENDPOINT}/me/drive/root:/${pathCarpeta}:/children`;
    const body = {
        name: folderName,
        folder: {},
        '@microsoft.graph.conflictBehavior': 'rename'
    };
    const headers = {
        headers: {
            Authorization: `Bearer ${token.accessToken}`,
            'Content-Type': 'application/json'
        }
    };
    try {
        const response = await createSource(url, body, headers);
        res.status(201).json({
            msg: 'Carpeta creada con exito',
            folder: response.data
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
};

//funcion solicitar un nuevo token de acesso cuando el anterior expire
const requestNewToken = async (token) => {

    const tokenRequest = {
        client_id: process.env.CLIENT_ID,   // Agrega tu client_id
        redirect_uri: 'http://localhost:3000/redirect',
        client_secret: process.env.CLIENT_SECRET, // Agrega tu client_secret
        refresh_token: token.refreshToken,  // token de refresco que debe estar en la bd
        grant_type: 'refresh_token',
    };
    try {
        const { data } = await getTokenRefreshed(tokenRequest);
        const expiresIn = data.expires_in;
        const acessToken = data.access_token;
        const refreshToken = data.refresh_token;
        //console.log( await createToken(acessToken, refreshToken, expiresIn) ); //usar la primera vez
        updateToken(token, acessToken, refreshToken, expiresIn);
        //console.log(data);
        return await saveToken(token);

    } catch (error) {
        throw error;
    }
}

const deleteFile = async (req, res) => {
    const token = req.token;
    const {itemId} = req.params;
    try {
        const url = `${process.env.GRAPH_API_ENDPOINT}/me/drive/items/${itemId}`;
        const response = await deleteSource(url, token.accessToken);
        res.status(200).json({
            msg: `Archivo: ${itemId} eliminado con exito`,
            data: response.data
        })
    } catch (error) {
        res.status(400).json({
            msg: `Error al eliminar archivo: ${itemId} `,
            error: error
        })
    }
}

module.exports = {
    createLinkShared,
    createFolder,
    deleteFile,
    getFilesInFolder,
    getInformationFile,
    requestNewToken,
    uploadFile,
    loginMicrosoft,
    obtenerTokenMicrosoft,
}