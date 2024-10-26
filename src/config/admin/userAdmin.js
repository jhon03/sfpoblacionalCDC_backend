const { crearUser } = require("../../infraestructura/controllers/user.controllers");
const { encryptarContra } = require("../../infraestructura/helpers/globales.helpers");
const { buscarColaboradorByIdOrDocumento, obtenerColaboradorByIdentificacion, crearInstanciaColaborador, guardarColaborador } = require("../../infraestructura/helpers/colaborador.helpers");
const { buscarRolByName, crearInstanciaRol, guardarRol } = require("../../infraestructura/helpers/rol.helpers");
const { buscarIdentificacionByIdOrName, crearInstanciaIdentificacion, guardarIdentificacion } = require("../../infraestructura/helpers/tipoIdentificacion.helpers");
const { buscarUserByColaborador } = require("../../infraestructura/helpers/user.helpers");

const infoAdmin = {
    numeroIdentificacion: 1112469726,
    nombre: "John Hoyos",
    nombreUsuario: "johnA@",
    contrasena: "johnAnderson@"
}

const crearUserAdmin = async () => {
    try {
        const colaboradorAdmin = await buscarColaboradorByIdOrDocumento('', infoAdmin.numeroIdentificacion);
        //const userAdmin = await buscarUserByColaborador(colaboradorAdmin.idColaborador);
        if(!colaboradorAdmin){
            //consultamos o creamos (de ser necesario) la identificacion del administrador
            const tipoIdentificacion = await crearIdentificacionInicial();
            const rol = await crearRolInicial();
            let datos = {
                tipoIdentificacion: tipoIdentificacion.idIdentificacion,
                numeroIdentificacion: infoAdmin.numeroIdentificacion,
                nombreColaborador: infoAdmin.nombre,
                nombreUsuario: infoAdmin.nombreUsuario,
                contrasena: infoAdmin.contrasena,
            }
            encryptarContra(datos);
            if( await obtenerColaboradorByIdentificacion(datos.numeroIdentificacion) ) {
                throw new Error("El numero de identificacion que introduciste ya existe");
            };
            const colaborador = crearInstanciaColaborador(datos);
            await guardarColaborador(colaborador);
            const userDto = await crearUser(colaborador, datos, rol);
            console.log(`Usuario administrador creado correctamente`);
        } else {
            console.log(`El usuario administrador ya a sido creado`);
        }
    } catch (error) {
        console.log(error.message);
    }
};

const crearIdentificacionInicial = async() => {
    try {
        let adminIdentificacion = await buscarIdentificacionByIdOrName("", "CEDULA CIUDADANIA");
        if(!adminIdentificacion){
            adminIdentificacion = crearInstanciaIdentificacion("cedula ciudadania");
            await guardarIdentificacion(adminIdentificacion);
        };
        return adminIdentificacion;
    } catch (error) {
        throw error;
    }
};

const crearRolInicial = async () => {
    try {
        let adminRol = await buscarRolByName("SUPERUSER");
        if(!adminRol){
            adminRol = crearInstanciaRol({
                nombreRol: "superuser",
                descripcion: "este rol esta destinado exclusivamente para el administrador total de la app"
            });
            const inicialRol = crearInstanciaRol({
                nombreRol: "administrador",
                descripcion: "este rol esta destinado para el administrador"
            });
            await guardarRol(adminRol);
            await guardarRol(inicialRol);
        };
        return adminRol;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    crearUserAdmin,
}