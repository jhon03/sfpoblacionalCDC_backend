const { colaboradoresToColaboradoresDto, colaboradorToColaboradorDto } = require('../../aplicacion/mappers/colaborador.mapper');
const { crearInstanciaColaborador, guardarColaborador, obtenerColaboradores, obtenerColaboradorByIdentificacion, cambiarEstadoColaborador, updateColaborador } = require('../helpers/colaborador.helpers');
const { encryptarContra, obtenerPaginasDisponibles, getPagesAvalaible } = require('../helpers/globales.helpers');
const { buscarIdentificacionByIdOrName } = require('../helpers/tipoIdentificacion.helpers');
const { contrasenaEsValida} = require('../helpers/user.helpers');
const { crearUser } = require('./user.controllers');
const { obtenerFechaColombia } = require('../helpers/globales.helpers');
const { Colaborador } = require('../../dominio/models');
const {user} = require('../../dominio/models');
const {Rol} = require('../../dominio/models');
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

//nuevo controlador para obtener colaboradores con rol
const obtenerColaboradoresConRol = async (req, res) => {
    const page = parseInt(req.query.page) || 1;  // Número de página desde los query params, por defecto 1
    const pageSize = parseInt(req.query.pageSize) || 10;  // Tamaño de página, por defecto 10
    const skip = (page - 1) * pageSize;  // Cuántos colaboradores omitir según la página

    try {
        // Obtener el total de colaboradores (para calcular el total de páginas)
        const totalColaboradores = await Colaborador.countDocuments();

        // Obtener los colaboradores con paginación
        const colaboradores = await Colaborador.find()
            .skip(skip)  // Saltar los colaboradores previos
            .limit(pageSize)  // Limitar el número de colaboradores a `pageSize`
            .exec();

        if (!colaboradores || colaboradores.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron colaboradores' });
        }

        const resultado = [];

        for (const colaborador of colaboradores) {
            if (!colaborador || !colaborador.idColaborador) {
                continue;
            }

            // Depuración: Verificar el modelo User
            console.log('Modelo User:', user);  // Verifica si User está bien importado

            // Buscar el usuario asociado al colaborador
            console.log('Buscando usuario con colaborador:', colaborador.idColaborador);
            const usuario = await user.findOne({ colaborador: colaborador.idColaborador });

            // Depuración: Verificar si se encontró un usuario
            console.log('Usuario encontrado:', usuario);

            // Manejar si no se encuentra un usuario asociado
            if (!usuario) {
                console.error(`No se encontró un usuario para el colaborador con id ${colaborador.idColaborador}`);
            }

            // Buscar rol por el UUID del usuario
            const rol = await Rol.findOne({ idRol: usuario?.rol });
            console.log('Rol encontrado', rol);

            // Sino se encuentra el rol, se asigna 'sin rol'
            const nombreRol = rol ? rol.nombreRol : 'sin rol';

            // Construir el resultado final
            resultado.push({
                idColaborador: colaborador.idColaborador,
                nombreColaborador: colaborador.nombreColaborador,
                nombreUsuario: usuario?.nombreUsuario,  // Verificar si el usuario es nulo
                rol: nombreRol.trim(),  // Comprobar si usuario es nulo
                estado: colaborador.estado,
                fechaCreacion: colaborador.fechaCreacion,
                fechaModificacion: colaborador.fechaModificacion,
            });
        }

        // Calcular el total de páginas
        const totalPaginas = Math.ceil(totalColaboradores / pageSize);

        // Responder con los colaboradores paginados y el total de colaboradores
        res.status(200).json({
            total: totalColaboradores,
            totalPaginas: totalPaginas,
            colaboradores: resultado
        });

    } catch (error) {
        console.error('Error al obtener colaboradores:', error);
        res.status(500).json({
            mensaje: 'Error al obtener colaboradores',
            error: error.message || error  // Devolver el mensaje de error más explícito
        });
    }
};


const desactivarColaborador = async (req, res) => {
    const { colaborador } = req
    try {
        cambiarEstadoColaborador(colaborador, "DESACTIVAR");
        const colaboradorEli = await guardarColaborador(colaborador);
        return res.json({
            msg: `El colaborador ${colaboradorEli.nombreColaborador} se ha inhabilitado correctamente`,
        });
    } catch (error) {
        return res.status(400).json({
            msg: "Error al desactivar el colaborador",
            error: error.message,
        });
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
    obtenerColaboradoresConRol

}