const { buscarIdentificacionByIdOrName } = require('../helpers/tipoIdentificacion.helpers');
const { buscarColaboradorByIdOrDocumento } = require('../helpers/colaborador.helpers');
const { obtenerProgramaById } = require('../helpers/programa.helpers');


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
}

module.exports = {
    obtenerColaborador,
    obtenerPrograma,
    obtenerTipoIdentificacion
}