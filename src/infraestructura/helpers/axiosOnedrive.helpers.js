const axios = require('axios');
const qs = require('querystring');


const getSource = async (url, tokenAcess) => {
    try {
        const response = await axios.get(
            url,
            {
                headers: {
                    Authorization: `Bearer ${tokenAcess}`
                }
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
}

const createSource = async (url, body, headers) => {
    try {
        console.log("creacion")
        const response = await axios.post
        (
            url, body, headers
        );
        console.log("creacion1")
        return response;
    } catch (error) {
        throw error;
    }
}

const uploadSource = async (url, fileContent, mimeType, tokenAcess) => {
    try {
        const response = await axios.put(url, fileContent,
            {
                headers: {
                    Authorization: `Bearer ${tokenAcess}`,
                    'Content-Type': mimeType
                }
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
};



const getTokenRefreshed = async (tokenRequest) => {
    try {
        const response = await axios.post(
            'https://login.microsoftonline.com/common/oauth2/v2.0/token',
            qs.stringify(tokenRequest),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
}

//funcion para obtner los tokens de refresco y acesso
const getTokenWithAuthorizationCode = async(code) => {
    const tokenUrl = `${process.env.MICROSOFT_LOGIN_URL}/token`;
    const params = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.REDIREC_URI
    };
    try {
        const response = await axios.post(tokenUrl, qs.stringify(params), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data
    } catch (error) {
        throw error;
    }
}

const deleteSource = async(url, tokenAcess) => {
    try {
        const response = await axios.delete(
            url,
            {
                headers: {
                    Authorization: `Bearer ${tokenAcess}`
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    createSource,
    deleteSource,
    getSource,
    getTokenRefreshed,
    uploadSource,
    getTokenWithAuthorizationCode,
}