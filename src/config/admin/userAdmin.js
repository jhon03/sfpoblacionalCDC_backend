const { crearUser } = require("../../infraestructura/controllers/user.controllers");
const { encryptarContra } = require("../../infraestructura/helpers/auth.helpers");
const { buscarColaboradorByIdOrDocumento, obtenerColaboradorByIdentificacion, crearInstanciaColaborador, guardarColaborador } = require("../../infraestructura/helpers/colaborador.helpers")
const { buscarIdentificacionByIdOrName } = require("../../infraestructura/helpers/tipoIdentificacion.helpers")


const crearUserAdmin = async () => {
    try {
        const adminExits = await buscarColaboradorByIdOrDocumento('', process.env.NUMERO_IDENTIFICACION);
        if(!adminExits){
            const tipoIdentificacion = await buscarIdentificacionByIdOrName("", "CEDULA CIUDADANIA");
            let datos = {
                tipoIdentificacion: tipoIdentificacion.idIdentificacion,
                numeroIdentificacion: process.env.NUMERO_IDENTIFICACION,
                nombreColaborador: 'jonatan',
                nombreUsuario: process.env.ADMIN_USER,
                contrasena: process.env.CONTRASENA_ADMIN,
            }
            encryptarContra(datos);
            if( await obtenerColaboradorByIdentificacion(datos.numeroIdentificacion) ) {
                throw new Error("El numero de identificacion que introduciste ya existe");
            };
            let colaborador = crearInstanciaColaborador(datos);
            await guardarColaborador(colaborador);
            let userDto = await crearUser(colaborador, datos, true);
            console.log("usuario administrador creado correctamente " + userDto);
        };
        console.log("El usuario administrador a sido creado con exito ");
    } catch (error) {  
        console.log(error.message);
    }
}

module.exports = {
    crearUserAdmin,
}