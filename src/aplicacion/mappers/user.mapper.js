const User = require('../../dominio/models/user.models');
const { buscarColaboradorByIdOrDocumento } = require('../../infraestructura/helpers/colaborador.helpers');
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
            return userToUserDto(user, colaborador);
        });

        const usersDto = await Promise.all(usersDtoPromises);
        return usersDto;
    } catch (error) {
        throw new Error("Error al mapear la informacion de los usuarios");
    }
};

module.exports = {
    userToUserDto,
    usersToUsersDto,
}