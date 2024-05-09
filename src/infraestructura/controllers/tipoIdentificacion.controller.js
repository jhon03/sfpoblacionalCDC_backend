const TipoIdentificacion = require('../../dominio/models/tipoIdentificacion.models');
const { generarId } = require('../helpers/globales.helpers');

const crearIdentificacion = async (req, res) => {
    try {
        let tipoIdentificacion = new TipoIdentificacion(req.body);
        tipoIdentificacion.idIdentificacion = generarId();

        await tipoIdentificacion.save();
        return res.status(201).json({
            msg: 'El tipo de identificacion a sido creada correctamente',
            tipoIdentificacion
        })
    } catch (error) {
        return res.status(400).json({
            msg: 'Error al crear el tipo de identificacion',
            error: error.message
        })
    }
};

const obtenerIdentificaciones = async (req, res) => {
    try {
        const Identificaciones = await TipoIdentificacion.find({estado: true});
        return res.json({
            msg: `Se encontraron ${Identificaciones.length} identificaciones`,
            Identificaciones
        })
    } catch (error) {
        return res.status(400).json({
            msg: 'Error al obtener las identificaciones',
            error: error.message
        })
    }
}

module.exports = {
    crearIdentificacion,
    obtenerIdentificaciones,
}