const tipoIdentificacionDto = require('../../aplicacion/dtos/tipoIdentificacion.dto');
const { identificacionToIdentificacionDto, identificacionesToIdentificacionesDto } = require('../../aplicacion/mappers/tipoIdentificacion.mapper');
const TipoIdentificacion = require('../../dominio/models/tipoIdentificacion.models');
const { generarId } = require('../helpers/globales.helpers');
const { crearInstanciaIdentificacion, guardarIdentificacion, buscarIdentificaciones, actualizarIdentificacion } = require('../helpers/tipoIdentificacion.helpers');

const crearIdentificacion = async (req, res) => {
    let { nombreIdentificacion } = req.body;
    try {

        const tipoIdentificacion = crearInstanciaIdentificacion(nombreIdentificacion);
        await guardarIdentificacion(tipoIdentificacion);
        const tipoIdentificacionDto = identificacionToIdentificacionDto(tipoIdentificacion);

        return res.status(201).json({
            msg: 'El tipo de identificacion a sido creada correctamente',
            tipoIdentificacion: tipoIdentificacionDto
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

        const Identificaciones = await buscarIdentificaciones();
        const IdentificacionesDto = identificacionesToIdentificacionesDto(Identificaciones);

        return res.json({
            msg: `Se encontraron ${Identificaciones.length} identificacion(es)`,
            Identificaciones: IdentificacionesDto
        })
    } catch (error) {
        return res.status(400).json({
            msg: 'Error al obtener las identificaciones',
            error: error.message
        })
    }
};

const actualizarTipoIdentificacion = async (req, res) => {
    const { nombreIdentificacion } = req.body;
    let tipoIdentificacion = req.tipoIdentificacion;
    try {
        if(!tipoIdentificacion.estado) throw new Error("El tipo de identificacion que deseas actualizar no existe o esta inactivo");
        actualizarIdentificacion( tipoIdentificacion, { nombreIdentificacion } );
        const nuevaIdentificacion = await guardarIdentificacion(tipoIdentificacion);
        const identificacionDto = identificacionToIdentificacionDto(nuevaIdentificacion);

        return res.json({
            msg: 'Tipo de identificacion actualizada correctamente',
            tipoIdentificacion: identificacionDto
        })
    } catch (error) {
        return res.status(400).json({
            msg: "Error al actualizar el tipo de identificacion",
            error: error.message
        })
    }
};

const desactivarTipoIdentificacion = async (req, res) => {
    let tipoIdentificacion = req.tipoIdentificacion;
    try {

        if(!tipoIdentificacion.estado) throw new Error('El tipo de identificacion ya esta inactivo');
        actualizarIdentificacion(tipoIdentificacion, { estado: "DESACTIVAR"});
        const identificacionDesactivada = await guardarIdentificacion(tipoIdentificacion);
        const identificacionDto = identificacionToIdentificacionDto(identificacionDesactivada);

        return res.json({
            msg: "Tipo de identificación desactivada correctamente",
            identificacion: identificacionDto
        })
    } catch (error) {
        return res.status(400).json({
            msg: "No se pudo eliminar el tipo de identificacion",
            error: error.message
        })
    }
};

const activarIdentificacion = async (req, res) => {
    const tipoIdentificacion = req.tipoIdentificacion;
    try {
        if(!tipoIdentificacion) throw new Error("El tipo de identificacion que deseas activar no existe");
        if(tipoIdentificacion.estado) throw new Error('EL tipo de identificacion ya esta activo');
        actualizarIdentificacion(tipoIdentificacion, {estado: "ACTIVAR"} );
        const tipoIdentificacionActivada = await guardarIdentificacion(tipoIdentificacion);
        return res.json({
            msg: 'tipo de identificacion activada correctamente',
            tipoIdentificacionActivada
        })
    } catch (error) {
        return res.status(400).json({
            msg: 'error al activar la identificacion',
            error: error.message
        })
    }
}

module.exports = {
    activarIdentificacion,
    actualizarTipoIdentificacion,
    crearIdentificacion,
    desactivarTipoIdentificacion,
    obtenerIdentificaciones,
}