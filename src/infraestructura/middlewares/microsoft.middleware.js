const { getToken } = require('../../config/microsoft/auth');


const authenticate = async (req, res, next) => {
    try {
        req.token = await getToken();
        next();
    } catch (error) {
        console.error('Error in authentication middleware:', error);
        res.status(500).send('Authentication error');
    }
};
  
module.exports = {
    authenticate
}