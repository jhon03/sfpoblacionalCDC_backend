const { identificacionToIdentificacionDto, identificacionesToIdentificacionesDto } = require('../../aplicacion/mappers/tipoIdentificacion.mapper');
const { TipoIdentificacion } = require('../../dominio/models');
const { getPagesAvalaible } = require('../helpers/globales.helpers');
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

    const {tokenAcessoRenovado} = req;
    const { page } = req.query; 
    const limit = 2;
    const desde = (page-1) * limit;

    try {

        const paginasDisponibles = await getPagesAvalaible(TipoIdentificacion, {estado:true}, limit, page);

        const Identificaciones = await buscarIdentificaciones(desde, limit);
        const IdentificacionesDto = identificacionesToIdentificacionesDto(Identificaciones);

        if(tokenAcessoRenovado){
            return res.json({
                pagina: `pagina ${page} de ${paginasDisponibles}`,
                msg: `Se encontraron ${Identificaciones.length} identificacion(es)`,
                Identificaciones: IdentificacionesDto,
                tokenAcessoRenovado
            })
        }
        return res.json({
            pagina: `pagina ${page} de ${paginasDisponibles}`,
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

//endpoint para obtener las entidades sin paginacion
const obtenerIdentificacionesNormal = async (req, res) => {

    const {tokenAcessoRenovado} = req;
    try {

        const Identificaciones = await buscarIdentificaciones();
        const IdentificacionesDto = identificacionesToIdentificacionesDto(Identificaciones);

        if(tokenAcessoRenovado){
            return res.json({
                msg: `Se encontraron ${Identificaciones.length} identificacion(es)`,
                Identificaciones: IdentificacionesDto,
                tokenAcessoRenovado
            })
        }
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
    obtenerIdentificacionesNormal
}