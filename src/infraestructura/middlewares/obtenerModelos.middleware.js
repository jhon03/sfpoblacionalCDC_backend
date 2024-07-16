const { buscarIdentificacionByIdOrName } = require('../helpers/tipoIdentificacion.helpers');
const { buscarColaboradorByIdOrDocumento } = require('../helpers/colaborador.helpers');
const { obtenerProgramaById } = require('../helpers/programa.helpers');
const { getPersonaById } = require('../helpers/personas.helpers');
const { buscarUserById, findUserByUsername } = require('../helpers/user.helpers');
const { buscarRoleById } = require('../helpers/rol.helpers');

//middleware obtener modelos por parametros en la uri

const obtenerTipoIdentificacion = (validar= false) => {
    return async (req, res, next) => {
        const { idIdentificacion, nombreIdentificacion } = req.params;
        const { tipoIdentificacion } = req.body;
        try {
            let tipoIdentificacionE;
            if(tipoIdentificacion){
                tipoIdentificacionE = await buscarIdentificacionByIdOrName(tipoIdentificacion);
            } else {
                tipoIdentificacionE = await buscarIdentificacionByIdOrName(idIdentificacion, nombreIdentificacion);
            }
            if(!tipoIdentificacionE) throw new Error("No existe el tipo de identificacion que deseas obtener");
            if (validar && !tipoIdentificacionE.estado){
                return res.status(404).json({
                    msg: 'El tipo de identificacion se encuentra inactivo'
                })
            };
            req.tipoIdentificacion = tipoIdentificacionE;
    
            next();
        } catch (error) {
            return res.status(400).json({
                msg: 'Error al validar el tipo de identificacion',
                error: error.message
            })
        }
    };
} ;

const obtenerColaborador = (validar= false) => {
    return async (req, res, next) => {
        const { idColaborador, numeroIdentificacionColaborador } = req.params;
        try {
            let colaborador;
            if(idColaborador){
                colaborador = await buscarColaboradorByIdOrDocumento(idColaborador);
            } else {
                colaborador = await buscarColaboradorByIdOrDocumento("", numeroIdentificacionColaborador);
            };
            if(!colaborador) throw new Error("No existe el colaborador que deseas obtener");
            if(validar && colaborador.estado === "INACTIVO" ){
                return res.status(404).json({
                    msg: "El colaborador que deseas obtener esta inactivo"
                })
            }
            
            req.colaborador = colaborador;
            next();
        } catch (error) {
            return res.status(400).json({
                msg: "Error al validar el colaborador",
                error: error.message
            })
        } 
    };
};

const obtenerPrograma = (validar = false) => {
    return async (req, res, next) => {
        const { idPrograma } = req.params;
        try {
            const programa = await obtenerProgramaById(idPrograma);
            if(!programa) throw new Error("No existe el programa que estas buscando");
            if(validar && programa.estado === "INACTIVO"){
                return res.status(404).json({
                    msg: "El programa que buscas esta inactivo",
                })
            };
            req.programa = programa;
            next();

        } catch (error) {
            return res.status(400).json({
                msg: "Error al obtener el programa",
                error: error.message
            })
        }
    }
};

const obtenerPersona = (validar = false) => {
    return async (req, res, next) => {
        const { idPersona } = req.params;
        try {
            const persona = await getPersonaById(idPersona);
            if(!persona) throw new Error("No existe La persona que estas buscando");
            if(validar && persona.estado === "INACTIVO"){
                return res.status(404).json({
                    msg: "La persona que buscas esta inactiva",
                })
            };
            req.persona = persona;
            next();

        } catch (error) {
            return res.status(400).json({
                msg: "Error al obtener el registro de la persona",
                error: error.message
            })
        }
    }
};

const obtenerUser = (validar=false) =>{
    return async (req, res, next) => {
        const {idUsuario} = req.params;
        try {
            const user = await buscarUserById(idUsuario);
            if(!user) throw new Error("No existe el usuario con el id: " + idUsuario);
            if(validar && user.estado === "INACTIVO"){
                return res.status(404).json({
                    msg: "El usuario que deseas obtener esta inactivo"
                })
            }
            req.user = user;
            next();
        } catch (error) {
            return res.status(400).json({
                msg: "Error al obtener el usuario",
                error: error.message
            })
        }
    }
};

//obtener rol tanto por paramentro como por el body
const obtenerRol = (validar=false) => {
    return async(req, res, next) => {
        const { idRol } = req.params;
        const { rol } = req.body;
        try {
            let rolExits = await buscarRoleById( idRol ?? rol);  
            if(!rolExits) throw new Error(`No existe el rol con el id: ${idRol??rol}`);
            if(validar && !rolExits.estado){
                return res.status(404).json({
                    msg: `El rol con el id ${idRol??rol} se encuentra inactivo`
                })
            }

            req.rol = rolExits;
            next();
        } catch (error) {
            return res.status(400).json({
                msg: "Error al obtener el usuario",
                error: error.message
            })
        }
    }
        
};

//middleware solo para validar existencia de un username
const obtenerUsuarioByUserName = (validar=false) => {
    return async (req, res, next) => {
        const { nombreUsuario } = req.body;
        try {
            const user = await findUserByUsername(nombreUsuario);
            if(!user && !validar) throw new Error("El usuario que buscas no existe");
            if(validar && user && user.estado === "ACTIVO"){
                return res.status(400).json({
                    error: `El nombre de usuario ${nombreUsuario} ya esta en uso`
                })
            };
            req.user = user;
            next();
        } catch (error) {
            return res.status(400).json({
                msg:"Error al obtener el usuario por el nombre de usuario",
                error: error.message,
            })
        }
    }
}


module.exports = {
    obtenerColaborador,
    obtenerPrograma,
    obtenerPersona,
    obtenerRol,
    obtenerTipoIdentificacion,
    obtenerUser,
    obtenerUsuarioByUserName,
}