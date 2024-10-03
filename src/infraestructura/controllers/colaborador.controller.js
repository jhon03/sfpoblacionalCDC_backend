const { colaboradoresToColaboradoresDto, colaboradorToColaboradorDto } = require('../../aplicacion/mappers/colaborador.mapper');
const { crearInstanciaColaborador, guardarColaborador, obtenerColaboradores, obtenerColaboradorByIdentificacion, cambiarEstadoColaborador, updateColaborador } = require('../helpers/colaborador.helpers');
const { encryptarContra, obtenerPaginasDisponibles, getPagesAvalaible } = require('../helpers/globales.helpers');
const { buscarIdentificacionByIdOrName } = require('../helpers/tipoIdentificacion.helpers');
const { contrasenaEsValida} = require('../helpers/user.helpers');
const { crearUser } = require('./user.controllers');
const { obtenerFechaColombia } = require('../helpers/globales.helpers');
const { Colaborador } = require('../../dominio/models');
const { request } = require('express');




const registrarColaborador = async (req, res) => {
    let { tipoIdentificacion, body:datos, rol } = req
    try {
        contrasenaEsValida(datos.contrasena);
        encryptarContra(datos)
        if( await obtenerColaboradorByIdentificacion(datos.numeroIdentificacion) ) {
            throw new Error("El numero de identificacion que introduciste ya existe");
        };
        let colaborador = crearInstanciaColaborador(datos);
        await guardarColaborador(colaborador);
        let userDto = await crearUser(colaborador, datos, rol);
        const colaboradorDto = colaboradorToColaboradorDto(colaborador, tipoIdentificacion);
        return res.status(201).json({
            msg: 'EL colaborador a sido creado correctamente',
            colaborador: colaboradorDto,
            usuario: userDto
        })
    } catch (error) {
        return res.status(400).json({
            msg: 'Error al registrar el colaborador',
            error: error.message
        })
    }
}

const listColaboradores = async (req= request, res) =>{
    const {tokenAcessoRenovado} = req;
    const { page } = req.query; 
    const limit = 10;
    const desde = (page-1) * limit;

    try {
         
        const paginasDisponibles = await getPagesAvalaible(Colaborador, {estado:"ACTIVO"}, limit, page);

        const listColaboradores = await obtenerColaboradores(desde, limit);
        const listColaboradoresDto = await colaboradoresToColaboradoresDto(listColaboradores);

        if(tokenAcessoRenovado){
            return res.json({
                pagina: `pagina ${page} de ${paginasDisponibles}`,
                msg: `Se encontraron ${listColaboradores.length} colaboradores`,
                colaboradores: listColaboradoresDto,
                tokenAcessoRenovado
            })
        }
        return res.json({
            pagina: `pagina ${page} de ${paginasDisponibles}`,
            msg: `Se encontraron ${listColaboradores.length} colaboradores`,
            colaboradores: listColaboradoresDto
        })
    } catch (error) {
        return res.status(400).json({
            msg: 'Error al obtener la lista de colaboradores',
            error: error.message
        })
    }
};

const desactivarColaborador = async (req, res) => {
    const { colaborador } = req
    try {
        cambiarEstadoColaborador(colaborador, "DESACTIVAR");
        const colaboradorEli = await guardarColaborador(colaborador);
        return res.json({
            msg: `El colaborador ${colaboradorEli.nombreColaborador} ha sido eliminado correctamente`,
        })
    } catch (error) {
        return res.status(400).json({
            msg: "Error al desactivar el colaborador",
            error: error.message,
        })
    }
};

const activarColaborador = async(req, res) => {
    const { colaborador } = req;
    try {
        if(colaborador.estado === "ACTIVO") throw new Error("El colaborador actualmente esta activo");
        cambiarEstadoColaborador(colaborador, "ACTIVAR");

        const tipoIdentificacion = await buscarIdentificacionByIdOrName(colaborador.tipoIdentificacion);

        const colaboradorActi = await guardarColaborador(colaborador);
        const colaboradorDto = colaboradorToColaboradorDto(colaboradorActi, tipoIdentificacion);
        return res.json({
            msg: "Colaborador activado correctamente",
            colaborador: colaboradorDto
        })
    } catch (error) {
        return res.status(400).json({
            msg: "Error al activar el colaborador",
            error: error.message,
        })
    }
};

const buscarColaboradorById = async (req, res) => {
    const { colaborador } = req;
    try {
        const tipoIdentificacion = await buscarIdentificacionByIdOrName(colaborador.tipoIdentificacion);
        const colaboradorDto = colaboradorToColaboradorDto(colaborador, tipoIdentificacion);
        return res.json({
            msg: "Colaborador obtenido correctamnete",
            colaborador: colaboradorDto
        })
    } catch (error) {
        return res.status(400).json({
            msg: "Error al buscar el colaborador",
            error: error.messgage
        })
    }
};

const actualizarColaborador = async (req, res) => {
    let { colaborador, body:datos } = req;
    try {
        updateColaborador(colaborador, datos);
        colaborador.fechaModificacion = obtenerFechaColombia();
        const tipoIdentificacion = await buscarIdentificacionByIdOrName(colaborador.tipoIdentificacion);
        await guardarColaborador(colaborador);
        const colaboradorDto = colaboradorToColaboradorDto(colaborador, tipoIdentificacion);
        return res.status(400).json({
            msg: "Colaborador actualizado con exito",
            colaborador: colaboradorDto
        }) 

    } catch (error) {
        return res.status(400).json({
            msg: "Error al actualizar el colaborador",
            error: error.message
        })
    }
};


module.exports = {
    activarColaborador,
    actualizarColaborador,
    buscarColaboradorById,
    desactivarColaborador,
    listColaboradores,
    registrarColaborador,

}