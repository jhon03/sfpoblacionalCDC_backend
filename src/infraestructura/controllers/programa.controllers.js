const { programaToProgramaDto, programasToProgramasDtos } = require("../../aplicacion/mappers/programa.mapper");
const { buscarColaboradorByIdOrDocumento } = require("../helpers/colaborador.helpers");
const { validarFormato, convertirClavesAMayusculas, validarclaves } = require("../helpers/formato.helpers");
const { obtenerPersonasEnPrograma } = require("../helpers/personas.helpers");
const { crearInstanciaPrograma, guardarPrograma, buscarProgramaByName, obtenerProgramas, updatePrograma, obtenerProgramaConfirmacion } = require("../helpers/programa.helpers");

const crearPrograma = async (req, res) => {
    let {colaborador } = req;
    let {informacion, nombrePrograma} = req.body
    try {
        informacion = convertirClavesAMayusculas(informacion);
        //validarFormato(formato);
        if( await buscarProgramaByName(nombrePrograma)) throw new Error("Ya existe un programa con el nombre: " + nombrePrograma)
        const programa = crearInstanciaPrograma({nombrePrograma, informacion}, colaborador);
        await guardarPrograma(programa);
        const programaDto = programaToProgramaDto(programa, colaborador);
        return res.status(201).json({
            msg: "Programa creado correctamente",
            programa: programaDto,
        })
    } catch (error) {
        return res.status(400).json({
            msg: "Error al crear el programa",
            error: error.message
        })
    }
};


const obtenerListaProgramas = async (req, res) => {
    try {
        const programas = await obtenerProgramas();
        const programasDto = await programasToProgramasDtos(programas);
        return res.json({
            msg: `se encontraron ${programas.length} programas`,
            programas: programasDto
        })
    } catch (error) {
        return res.status(400).json({
            msg: "Error al obtener los programas",
            error: error.message
        })
    }
};

const obtenerProgramasEnEspera = async (req, res) => {
    try {
        const programas = await obtenerProgramaConfirmacion();
        const programasDto = await programasToProgramasDtos(programas);
        return res.json({
            msg:`Se encontraron ${programas.length} en espera a ser confirmados`,
            programas: programasDto,
        })
    } catch (error) {
        return  res.status(400).json({
            msg: "Error al obtener la lista de programas en espera de confirmacion",
            error: error.message
        })
    }
}

const actualizarPrograma = async (req, res) => {
    let {programa, body: datos} = req;
    try {
        validarclaves(programa.informacion, datos.informacion);
        await updatePrograma(programa, datos);
        const colaborador = await buscarColaboradorByIdOrDocumento(programa.colaboradorCreador);
        const programaActualizado = await guardarPrograma(programa);
        const colaboradorAsignado = await buscarColaboradorByIdOrDocumento(programa.colaboradorResponsable);
        const programaDto = programaToProgramaDto(programaActualizado, colaborador, colaboradorAsignado);
        return res.json({
            msg: "El programa ha sido actualizado correctamente",
            programa: programaDto
        })
    } catch (error) {
        return res.status(400).json({
            msg: "Error al actualizar el programa",
            error: error.message
        })
    }
};

const desactivarPrograma= async(req, res) => {
    let {programa} = req;
    try {
        await updatePrograma(programa, {estado: "DESACTIVAR"});
        const programaDesactivado = await guardarPrograma(programa);
        const colaborador = await buscarColaboradorByIdOrDocumento(programa.colaborador);
        const colaboradorAsignado = await buscarColaboradorByIdOrDocumento(programa.colaboradorResponsable);
        const programaDto = programaToProgramaDto(programaDesactivado, colaborador, colaboradorAsignado);
        return res.json({
            msg: "Programa desactivado correctamente",
            programa: programaDto
        })
    } catch (error) {
        return res.status(400).json({
            msg: "Error al desactivar el formato",
            error: error.message
        })
    }
}

const activarPrograma = async (req, res) => {
    let {programa} = req;
    try {
        if(programa.estado === "ACTIVO") throw new Error('El programa ya se encuentra activo');
        await updatePrograma(programa, {estado: "ACTIVAR"});
        const programaActivado = await guardarPrograma(programa);
        const colaborador = await buscarColaboradorByIdOrDocumento(programa.colaborador);
        const colaboradorAsignado = await buscarColaboradorByIdOrDocumento(programa.colaboradorResponsable);
        const programaDto = programaToProgramaDto(programaActivado, colaborador, colaboradorAsignado);
        return res.json({
            msg: "Programa activado correctamente",
            programa: programaDto
        })
    } catch (error) {
        return res.status(400).json({
            msg: "Error al activar el programa",
            error: error.message
        })
    }
};

const confirmaPrograma = async (req, res) => {
    let {programa, colaborador: colaboradorAsignado} = req;
    try {
        if(programa.estado === "ACTIVO") throw new Error("El programa ya asido validado y confirmado");
        await updatePrograma(programa, {estado: "CONFIRMAR"});
        programa.colaboradorResponsable = colaboradorAsignado.idColaborador;
        const programaActivado = await guardarPrograma(programa);
        const colaborador = await buscarColaboradorByIdOrDocumento(programa.colaboradorCreador);
        const programaDto = programaToProgramaDto(programaActivado, colaborador, colaboradorAsignado);
        return res.json({
            msg: "Programa confirmado correctamente, se asigno correctamnete el colaborador responsable",
            programa: programaDto
        })
    } catch (error) {
        return res.status(400).json({
            msg: "Error al confirmar el programa",
            error: error.message,
        })
    }
}




module.exports = {
    actualizarPrograma,
    activarPrograma,
    crearPrograma,
    confirmaPrograma,
    desactivarPrograma,
    obtenerListaProgramas,
    obtenerProgramasEnEspera
}