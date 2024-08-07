const { request, response } = require("express");

const jwt = require('jsonwebtoken');
const { obtenerToken, verificarToken, validarExpiracionToken } = require("../helpers/jwt.helpers");
const { validarUsuario } = require("../helpers/auth.helpers");

const validarJWT = async(req= request, res = response, next) => {

    const token = obtenerToken(req);
    if(!token){
        return res.status(401).json({
            msg: 'no hay token en la peticion'
        })
    }

    try {       
        const uuid = verificarToken(token, process.env.SECRETORPRIVATEKEY);
        const tokenDecoded = jwt.decode(token);
        // if(validarExpiracionToken(tokenDecoded.exp) ){
        //     await validarTokenRe(uid);
        //     const tokenAcessoRenovado = await generarJWT(uid);
        //     req.tokenRenovado = tokenAcessoRenovado;
        // }

        const usuario = await validarUsuario(uuid);        
        req.user = usuario;

        next();
    } catch (error) {
        res.status(401).json({
            msg: 'token no valido',
            error: error.message
        })
    }


};

module.exports = {
    validarJWT
}
