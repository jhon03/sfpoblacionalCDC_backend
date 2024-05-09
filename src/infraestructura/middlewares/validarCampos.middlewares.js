const { validateCamposPermitidosHelper } = require("../helpers/globales.helpers");


//validamos los campos del producto a crear para que solo esten los necesarios y permitidos
const validateCamposPermitidos = (camposPermitidos) => {
    return (req, res, next) => {
        try {
            validateCamposPermitidosHelper(req.body, camposPermitidos);
            next();
        } catch (error) {
            return res.status(400).json({
                error: error.message,
            });
        }
    };
};

module.exports = {
    validateCamposPermitidos,
}