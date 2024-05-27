const { programaToProgramaDto, programasToProgramasDtos } = require("../../aplicacion/mappers/programa.mapper");
const { buscarColaboradorByIdOrDocumento } = require("../helpers/colaborador.helpers");
const { validarFormato, convertirClavesAMayusculas } = require("../helpers/formato.helpers");
const { obtenerPersonasEnPrograma } = require("../helpers/personas.helpers");
const { crearInstanciaPrograma, guardarPrograma, buscarProgramaByName, obtenerProgramas, updatePrograma } = require("../helpers/programa.helpers");

const crearPrograma = async (req, res) => {
    let {colaborador } = req;
    let {formato, nombrePrograma} = req.body
    try {
        formato = convertirClavesAMayusculas(formato);
        validarFormato(formato);

        if( await buscarProgramaByName(nombrePrograma)) throw new Error("Ya existe un programa con el nombre: " + nombrePrograma)
        const programa = crearInstanciaPrograma({nombrePrograma, formato}, colaborador);
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

const actualizarPrograma = async (req, res) => {
    let {programa, body: datos} = req;
    try {
        await updatePrograma(programa, datos);
        const colaborador = await buscarColaboradorByIdOrDocumento(programa.colaborador);
        const programaActualizado = await guardarPrograma(programa);
        const programaDto = programaToProgramaDto(programaActualizado, colaborador);
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
        const programaDto = programaToProgramaDto(programaDesactivado, colaborador);
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
        const programaDto = programaToProgramaDto(programaActivado, colaborador);
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
}


module.exports = {
    actualizarPrograma,
    activarPrograma,
    crearPrograma,
    desactivarPrograma,
    obtenerListaProgramas,
}