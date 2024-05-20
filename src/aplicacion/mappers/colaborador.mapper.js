const { buscarIdentificacionByIdOrName } = require("../../infraestructura/helpers/tipoIdentificacion.helpers");
const ColaboradorDto = require("../dtos/colaborador.dto")


const colaboradorToColaboradorDto = (colaborador, tipoIdentificacion) => {
    try {      
        const colaboradorDto = new ColaboradorDto(colaborador, tipoIdentificacion);
        return colaboradorDto;
    } catch (error) {
        throw new Error("Error al mapear el colaborador");
    }
};

const colaboradoresToColaboradoresDto = async (colaboradores) => {
    try {
        const colaboradoresDtoPromises = colaboradores.map(async colaborador => { 
            const tipoIdentificacion = await buscarIdentificacionByIdOrName(colaborador.tipoIdentificacion);
            return colaboradorToColaboradorDto(colaborador, tipoIdentificacion);
        });
        const colaboradoresDto = await Promise.all(colaboradoresDtoPromises);
        return colaboradoresDto;
    } catch (error) {
        throw new Error("Error al mapear los colaboradores");
    }
};


module.exports = {
    colaboradorToColaboradorDto,
    colaboradoresToColaboradoresDto,
}