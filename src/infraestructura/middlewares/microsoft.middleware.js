const { requestNewToken } = require("../controllers/onedrive.controller");
const { getTokenRefreshed } = require("../helpers/axiosOnedrive.helpers");
const { findToken, validarExpiracionToken } = require("../helpers/token.helpers");


const authenticate = async (req, res, next) => {
    try {
        const tokenMicrosoft = await findToken();
        const tokenExpired = validarExpiracionToken(tokenMicrosoft.expiresAt);

        if(tokenExpired){
            const tokenRefreshed = await requestNewToken(tokenMicrosoft);
            req.token = tokenRefreshed;
        } else {
            req.token = tokenMicrosoft;
        }
        next();
    } catch (error) {
        console.error('Error in authentication middleware:', error);
        res.status(500).json({
            msg: 'Authentication error'
        });
    }
};

module.exports = {
    authenticate
}