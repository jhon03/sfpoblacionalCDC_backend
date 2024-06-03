const RolDto = require('../dtos/rol.dto');

const rolToRolDto = (rol) => {
    try {
        const rolDto = new RolDto(rol);
        return rolDto;
    } catch (error) {
        throw new Error("Error al mapear los datos del rol");
    }
};

const rolsToRolsDto = (roles) => {
    try {
        const rolesDto = roles.map( rol => rolToRolDto(rol));
        return rolesDto;
    } catch (error) {
        throw new Error("Error al mapear los datos de los roles");
    }
};

module.exports = {
    rolToRolDto,
    rolsToRolsDto,
}