const User = require('../../dominio/models/user.models');
const { buscarColaboradorByIdOrDocumento } = require('../../infraestructura/helpers/colaborador.helpers');
const { buscarRoleById } = require('../../infraestructura/helpers/rol.helpers');
const UserDto = require('../dtos/user.dto');



const userToUserDto = (user, colaborador, rol) => {
    try {
        const userDto = new UserDto(user, colaborador, rol);
        return userDto;
    } catch (error) {
        throw new Error(error.message);
    }
};

const usersToUsersDto = async (users) => {
    try {
        const usersDtoPromises = users.map( async user => {
            const colaborador = await buscarColaboradorByIdOrDocumento(user.colaborador);
            const rol = await buscarRoleById(user.rol);
            return userToUserDto(user, colaborador, rol);
        });

        const usersDto = await Promise.all(usersDtoPromises);
        return usersDto;
    } catch (error) {
        console.log(error.message)
        throw new Error("Error al mapear la informacion de los usuarios");
    }
};

module.exports = {
    userToUserDto,
    usersToUsersDto,
}