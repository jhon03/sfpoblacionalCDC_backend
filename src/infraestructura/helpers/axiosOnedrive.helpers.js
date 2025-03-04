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
        const response = await axios.post
        ( 
            url, body, headers 
        );
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


module.exports = {
    createSource,
    getSource,
    getTokenRefreshed,
    uploadSource,
}