const { programaToProgramaDto, programasToProgramasDtos } = require("../../dominio/mappers/programa.mapper");
const { crearInstanciaPrograma, guardarPrograma, buscarProgramaByName, obtenerProgramas } = require("../helpers/programa.helpers");

const crearPrograma = async (req, res) => {
    const {colaborador, body: datos} = req;
    try {
        if( await buscarProgramaByName(datos.nombrePrograma)) throw new Error("Ya existe un programa con el nombre: " + datos.nombrePrograma)
        const programa = crearInstanciaPrograma(datos, colaborador);
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
}


module.exports = {
    crearPrograma,
    obtenerListaProgramas,
}