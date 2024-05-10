const TipoIdentificacion = require('../../dominio/models/tipoIdentificacion.models');
const { generarId } = require('../helpers/globales.helpers');
const { crearInstanciaIdentificacion, guardarIdentificacion, buscarIdentificaciones, actualizarIdentificacion } = require('../helpers/tipoIdentificacion.helpers');

const crearIdentificacion = async (req, res) => {
    let { nombreIdentificacion } = req.body;
    try {

        const tipoIdentificacion = crearInstanciaIdentificacion(nombreIdentificacion);
        await guardarIdentificacion(tipoIdentificacion);

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
        const Identificaciones = await buscarIdentificaciones();

        return res.json({
            msg: `Se encontraron ${Identificaciones.length} identificacion(es)`,
            Identificaciones
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

        actualizarIdentificacion( tipoIdentificacion, { nombreIdentificacion } );
        const nuevaIdentificacion = await guardarIdentificacion(tipoIdentificacion);

        return res.json({
            mag: 'Tipo de identificacion actualizada correctamente',
            tipoIdentificacion: nuevaIdentificacion
        })
    } catch (error) {
        return res.status(400).json({
            msg: "Error al actualizar el tipo de identificacion",
            error: error.message
        })
    }
};

const eliminarTipoIdentificacion = async (req, res) => {
    let tipoIdentificacion = req.tipoIdentificacion;
    try {

        if(!tipoIdentificacion.estado) throw new Error('El tipo de identificacion ya esta inactivo');
        actualizarIdentificacion(tipoIdentificacion, { estado: "desactivar"});
        const identificacionEliminiada = await guardarIdentificacion(tipoIdentificacion);
        console.log({identificacionEliminiada});

        return res.json({
            msg: "Tipo de identificación elimininada correctamente"
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
        console.log(tipoIdentificacion)
        if(tipoIdentificacion.estado) throw new Error('EL tipo de identificacion ya esta activo');
        actualizarIdentificacion(tipoIdentificacion, {estado: "activar"} );
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
    eliminarTipoIdentificacion,
    obtenerIdentificaciones,
}