const TipoIdentificacion = require('../../dominio/models/tipoIdentificacion.models');
const Colaborador = require('../../dominio/models/colaborador.models');
const { buscarIdentificacionByIdOrName } = require('../helpers/tipoIdentificacion.helpers');
const { buscarColaboradorByIdOrDocumento } = require('../helpers/colaborador.helpers');


const validarTipoIdentificacion = async (req, res, next) => {
    const { idIdentificacion, nombreIdentificacion } = req.params;
    const { tipoIdentificacion } = req.body;
    try {
        let tipoIdentificacionE;
        if(tipoIdentificacion){
            tipoIdentificacionE = await buscarIdentificacionByIdOrName(tipoIdentificacion);
        } else {
            tipoIdentificacionE = await buscarIdentificacionByIdOrName(idIdentificacion, nombreIdentificacion);
        }
        if (!tipoIdentificacionE){
            return res.status(404).json({
                msg: 'tipo de identificacion no encontrada',
            })
        };
        req.tipoIdentificacion = tipoIdentificacionE;

        next();
    } catch (error) {
        return res.status(400).json({
            msg: 'Error al validar el tipo de identificacion',
            error: error.message
        })
    }
};

const validarColaborador = async (req, res, next) => {
    const { idColaborador, numeroIdentificacionColaborador } = req.params;
    try {
        let colaborador;
        if(idColaborador){
            colaborador = await buscarColaboradorByIdOrDocumento(idColaborador);
        } else {
            colaborador = await buscarColaboradorByIdOrDocumento("", numeroIdentificacionColaborador);
        };
        if(!colaborador) throw new Error("No existe el colaborador que deseas obtener");
        req.colaborador = colaborador;
        next();
    } catch (error) {
        return res.status(400).json({
            msg: "Error al validar el colaborador",
            error: error.message
        })
    }
}

module.exports = {
    validarColaborador,
    validarTipoIdentificacion,
}