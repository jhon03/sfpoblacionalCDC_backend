const TipoIdentificacionDto = require('../dtos/tipoIdentificacion.dto');
const TipoIdentificacion    = require('../../dominio/models/tipoIdentificacion.models');


const identificacionToIdentificacionDto = (tipoIdentificacion) => {
    try {
        const tipoIdentificacionDto = new TipoIdentificacionDto(tipoIdentificacion);
        return tipoIdentificacionDto;
    } catch (error) {
        throw new Error("Error al mapear el tipo de identificacion");
    }
};

const identificacionesToIdentificacionesDto = (identificaciones) => {
    try {
        const identificacionesDto = identificaciones.map(identificacion =>  //return explicito
            identificacionToIdentificacionDto(identificacion)
        );
        return identificacionesDto;
    } catch (error) {
        throw new Error("Error a mapear los tipos de identificacion");
    }
};

module.exports = {
    identificacionToIdentificacionDto,
    identificacionesToIdentificacionesDto
}