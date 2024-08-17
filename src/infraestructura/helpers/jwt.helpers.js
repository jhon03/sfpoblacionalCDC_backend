const jwt = require('jsonwebtoken');
const { obtenerRefreshToken } = require('./user.helpers');

const generarJWT = (uuid ='') => {
    
    return new Promise( (resolve, rejec) =>{
        const payload = {uuid};

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: process.env.EXPIRATE_JWT_ACCESS
        }, (error, token) => {
            if(error){
                console.log(error);
                rejec('no se pudo generar el token de acesso')
            } else {
                resolve(token);
            }
        })
    })

};

const generarJWTRefresh = (uuid ='') =>{
    return new Promise( (resolve, rejec) =>{
        const payload = {uuid};

        jwt.sign(payload, process.env.SECRET_KEY_REFRESH_TOKEN, {
            expiresIn: process.env.EXPIRATE_JWT_REFRESH
        }, (error, token) => {
            if(error){
                console.log(error);
                rejec('no se pudo generar el token de refresco')
            } else {
                resolve(token);
            }
        })
    })
}

const obtenerToken = (req) =>{
    const token = req.headers['x-token'];
    return token;
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

const verificarToken = (token = '', claveSecreta = '') => {
    try {
        const {uuid} = jwt.verify(token, claveSecreta);
        return uuid;
    } catch (error) {
        throw error;
    }
};

const validarTokenRe = async (uid) => {
    try {
        const refreshToken = await obtenerRefreshToken(uid);
        verificarToken(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);
    } catch (error) {
        throw new Error('error al validar el token de refresco : ' + error.message);
    }
};


const decodificarToken = (token) => {
    try {
        const tokenDecoded = jwt.decode(token);
        return tokenDecoded;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    decodificarToken,
    generarJWT,
    generarJWTRefresh,
    obtenerToken,
    verificarToken,
    validarExpiracionToken,
    validarTokenRe,
}