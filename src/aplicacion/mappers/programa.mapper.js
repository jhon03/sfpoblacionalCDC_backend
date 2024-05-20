const { buscarColaboradorByIdOrDocumento } = require("../../infraestructura/helpers/colaborador.helpers");
const ProgramaDto = require("../dtos/programa.dto");

const programaToProgramaDto = (programa, colaborador) => {
    try {
        const programaDto = new ProgramaDto(programa, colaborador);
        return programaDto;
    } catch (error) {
        throw new Error("Error al mapear el programa");
    }
};

const programasToProgramasDtos = async (programas) => {
    try {
        const programaDtoPromises = programas.map(async programa => {
            const colaborador = await buscarColaboradorByIdOrDocumento(programa.colaborador);
            return programaToProgramaDto(programa, colaborador);
        });
        const programasDto = await Promise.all(programaDtoPromises);
        return programasDto;
    } catch (error) {
        throw new Error("Error al mapear los programas");
    }
}


module.exports = {
    programaToProgramaDto,
    programasToProgramasDtos,
}