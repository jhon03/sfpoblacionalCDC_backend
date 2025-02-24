const jwt = require('jsonwebtoken');
const { obtenerRefreshToken } = require('./user.helpers');

const generarJWT = (uuid = '', rol= '') => {
    
    return new Promise( (resolve, rejec) =>{
        const payload = {uuid, rol};

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
        console.log(`si la diferencia es menor a 10 se renueva el token aplicacion, diferencia: ${diferencia}`);
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
        const tokenDecoded = jwt.verify(token, claveSecreta);
        return tokenDecoded;
    } catch (error) {
        throw error;
    }
};

//helper para validar el token de refresco de un user que esta en el bd
const validarTokenRe = async (uid) => {
    try {
        const refreshToken = await obtenerRefreshToken(uid);
        verificarToken(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);
    } catch (error) {
        throw new Error('error al validar el token de refresco : ' + error.message);
    }
};

//helper para decodificar e token del usuario
const decodificarToken = (token) => {
    try {
        const tokenDecoded = jwt.decode(token);
        return tokenDecoded;
    } catch (error) {
        throw error;
    }
};

//helper para refrescar el token de refresco en la bd en caso de ser necesario
const manejarTokenDeRefresco = async (user) => {
    const refreshToken = user.refreshToken;
    if ( refreshToken && esTokenValido(user.refreshToken)) {
        user.refreshToken = await generarJWTRefresh(user.idUsuario);
    } else {
        user.refreshToken = await generarJWTRefresh(user.idUsuario);
    }
};

const esTokenValido = (tokenRefresco) => {
    const decodedToken = decodificarToken(tokenRefresco);
    const istokenExpired = validarExpiracionToken(decodedToken.exp);
    return istokenExpired;
};


module.exports = {
    decodificarToken,
    manejarTokenDeRefresco,
    generarJWT,
    generarJWTRefresh,
    obtenerToken,
    verificarToken,
    validarExpiracionToken,
    validarTokenRe,
}