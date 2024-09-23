const Token = require('../../dominio/models/onedrive/token.models');
const { generarId } = require('./globales.helpers');

//para usar directamente la primera vez
const createToken = async (accessToken, refreshToken, expiresIn) => {
    const expiresAt = Math.floor(Date.now() / 1000) + expiresIn; // Fecha exacta de expiración (en segundos)
    const newToken = new Token({
        idToken: "b36dc253-270d-4c1d-ba5d-3612a70d3494",
        accessToken,
        refreshToken,
        expiresAt
    });
    const token = await saveToken(newToken);
    return token;
};

const findToken = async () => {
    const idToken = "b36dc253-270d-4c1d-ba5d-3612a70d3494";
    try {
        const token = await Token.findOne({idToken});
        return token;
    } catch (error) {
        throw error;
    }
}

const updateToken = async (token, tokenAceso, tokenRefresco, expira) => {
    const expiresEn = Math.floor(Date.now() / 1000) + expira; // Fecha exacta de expiración (en segundos)
    try {
        token.accessToken = tokenAceso;
        token.refreshToken = tokenRefresco;
        token.expiresAt = expiresEn;
    } catch (error) {
        throw error;
    }
}

const saveToken = async (token) => {
    try {
        const tokenSaved = await token.save();
        return tokenSaved;
    } catch (error) {
        throw error;
    }
};

const isTokenExpired = (expiresAt) => {
    const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
    return currentTime >= expiresAt;
}

const validarExpiracionToken = (expiracion) =>{ 
    try {
        const ahora = Math.floor(Date.now() / 1000);
        const diferencia = (expiracion - ahora) / 60;
        console.log(`si la diferencia es menor a 10 se renueva el token, diferencia: ${diferencia}`);
        if(diferencia <= 10){
            return true;
        }
        return false;
    } catch (error) {
        throw new Error('error en el proceso de validar el token: ' + error.message);
    }
}


module.exports = {
    createToken,
    findToken,
    saveToken,
    validarExpiracionToken,
    updateToken
}