const axios = require("axios");

const fs = require('fs');
const { uploadSource, getSource, createSource, getTokenRefreshed } = require("../helpers/axiosOnedrive.helpers");
const { saveToken, createToken, findToken, validarExpiracionToken } = require("../helpers/token.helpers");

const apiEndpont = process.env.GRAPH_API_ENDPOINT;
const tokenAcess = process.env.TOKEN_ACESS;

const uploadFile = async (req, res) => {
    const { name: fileName, mimeType, tempFilePath} = req.files.archivo;
    try {
        const fileContent = fs.readFileSync(tempFilePath);
        const url = `${apiEndpont}/me/drive/root:/archivos_proyecto/${fileName}:/content`;
        const response = await uploadSource(url, fileContent, mimeType, tokenAcess);
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
        const token = await findToken();
        console.log(token);
        validarExpiracionToken(token.expiresAt);
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

// controlador para crear el link para ponerlo en la pagina web
const createLinkShared = async (req, res) => {
    const {itemId} = req.params;
    try {
        const url = `${process.env.GRAPH_API_ENDPOINT}/me/drive/items/${itemId}/createLink`;
        const body = {
            type: 'embed',
            scope: 'anonymous'
        }
        const headers = {
            headers: {
                Authorization: `Bearer ${tokenAcess}`,
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
    const pathCarpeta = 'archivos_proyecto';
    const url = `${process.env.GRAPH_API_ENDPOINT}/me/drive/root:/${pathCarpeta}:/children`;
    const body = {
        name: folderName,
        folder: {},
        '@microsoft.graph.conflictBehavior': 'rename'
    };
    const headers = {
        headers: {
            Authorization: `Bearer ${process.env.TOKEN_ACESS}`, //cambiar por implementacion en bd
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

// controlador para solicitar un nuevo token de acesso cuando el anterior expire
const requestNewToken = async (req, res) => {
    const refreshToken = req.refreshToken;
    const tokenRequest = {
        client_id: process.env.CLIENT_ID,   // Agrega tu client_id
        redirect_uri: 'http://localhost:3000/redirect',
        client_secret: process.env.CLIENT_SECRET, // Agrega tu client_secret
        refresh_token: refreshToken,  // al momento no implementado
        grant_type: 'refresh_token',
      };
    try {
        const response = await getTokenRefreshed(tokenRequest);
        const expiresIn = response.data.expires_in;
        const acessToken = response.data.access_token;
        const refreshToken = response.data.refresh_token;
        console.log( await createToken(acessToken, refreshToken, expiresIn) );
        res.status(200).json({
            msg: 'token acesso renovado correctamente',
            response: response.data
        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
}

module.exports = {
    createLinkShared,
    createFolder,
    getFilesInFolder,
    requestNewToken,
    uploadFile
}