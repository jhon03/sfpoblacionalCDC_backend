const { buscarColaboradorByIdOrDocumento } = require("../../infraestructura/helpers/colaborador.helpers");
const ProgramaDto = require("../dtos/programa.dto");

const programaToProgramaDto = (programa, colaborador, colaboradorAsignado = "") => {
    try {
        const programaDto = new ProgramaDto(programa, colaborador, colaboradorAsignado);
        return programaDto;
    } catch (error) {
        throw error;
    }
};

const programasToProgramasDtos = async (programas) => {
    try {

        const programaDtoPromises = programas.map(async programa => {
            const colaborador = await buscarColaboradorByIdOrDocumento(programa.colaboradorCreador);
            const colaboradorAsignado = await buscarColaboradorByIdOrDocumento(programa.colaboradorResponsable);
            return programaToProgramaDto(programa, colaborador, colaboradorAsignado);
        });
        const programasDto = await Promise.all(programaDtoPromises);
        return programasDto;
    } catch (error) {
        throw new Error(error.message);
    }
}


module.exports = {
    programaToProgramaDto,
    programasToProgramasDtos,
}