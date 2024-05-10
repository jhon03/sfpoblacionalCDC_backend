const TipoIdentificacion = require('../../dominio/models/tipoIdentificacion.models');
const Colaborador = require('../../dominio/models/colaborador.models');
const { buscarIdentificacionByIdOrName } = require('../helpers/tipoIdentificacion.helpers');


const validarTipoIdentificacion = async (req, res, next) => {
    const { idIdentificacion, nombreIdentificacion } = req.params;
    try {
        const tipoIdentificacion = await buscarIdentificacionByIdOrName(idIdentificacion, nombreIdentificacion);
        // if (!tipoIdentificacion){
        //     return res.status(404).json({
        //         msg: 'tipo de identificacion no encontrada',
        //     })
        // };
        req.tipoIdentificacion = tipoIdentificacion;

        next();
    } catch (error) {
        return res.status(400).json({
            msg: 'Error al validar el tipo de identificacion',
            error: error.message
        })
    }
};

module.exports = {
    validarTipoIdentificacion,
}