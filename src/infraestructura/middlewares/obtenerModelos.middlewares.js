const { obtenerColaboradorByIdentificacion } = require('../helpers/colaborador.helpers');
const { buscarIdentificacionByIdOrName } = require('../helpers/tipoIdentificacion.helpers');


const obtenerTipoIdentificacion = async (req, res, next) => {
    const { idIdentificacion, nombreIdentificacion } = req.params;
    const { tipoIdentificacion } = req.body;
    try {
        let tipoIdentificacionE;
        if(tipoIdentificacion){
            tipoIdentificacionE = await buscarIdentificacionByIdOrName(tipoIdentificacion);
        } else {
            tipoIdentificacionE = await buscarIdentificacionByIdOrName(idIdentificacion, nombreIdentificacion);
        }

        req.tipoIdentificacion = tipoIdentificacionE;

        next();
    } catch (error) {
        return res.status(400).json({
            msg: 'Error al validar el tipo de identificacion',
            error: error.message
        })
    }
};

const obtenerColaboradorIdentificacion = async (req, res, next) => {
    const {numeroIdentificacion} = req.body
    try {
        const colaborador = await obtenerColaboradorByIdentificacion(numeroIdentificacion);
        return colaborador;
    } catch (error) {
        return res.status(400).json({
            msg: "Error al obtener el colaborador por su numero de documento",
            error: error.message
        })
    }
}

module.exports = {
    obtenerTipoIdentificacion,
    obtenerColaboradorIdentificacion,
}


