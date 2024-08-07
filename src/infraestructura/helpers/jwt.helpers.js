const jwt = require('jsonwebtoken');

const generarJWT = (uuid ='', expiracion= '1h') => {
    
    return new Promise( (resolve, rejec) =>{
        const payload = {uuid};

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: expiracion
        }, (error, token) => {
            if(error){
                console.log(error);
                rejec('no se pudo generar el token')
            } else {
                resolve(token);
            }
        })
    })

};

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
}


module.exports = {
    generarJWT,
    obtenerToken,
    verificarToken,
    validarExpiracionToken,
}