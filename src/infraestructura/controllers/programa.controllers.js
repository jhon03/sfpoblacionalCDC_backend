const { programaToProgramaDto, programasToProgramasDtos } = require("../../aplicacion/mappers/programa.mapper");
const { Programa } = require("../../dominio/models");
const { buscarColaboradorByIdOrDocumento } = require("../helpers/colaborador.helpers");
const { validarFormato, convertirClavesAMayusculas, validarclaves, objetosIguales } = require("../helpers/formato.helpers");
const { obtenerPaginasDisponibles, getPagesAvalaible } = require("../helpers/globales.helpers");
const { obtenerPersonasEnPrograma } = require("../helpers/personas.helpers");
const { crearInstanciaPrograma, guardarPrograma, buscarProgramaByName, obtenerProgramas, updatePrograma, obtenerProgramaConfirmacion } = require("../helpers/programa.helpers");

//importancia del servicio de correo
const { enviarCorreo} = require('../helpers/email.helpers');

const crearPrograma = async (req, res) => {
    let {colaborador } = req;
    let {informacion, nombrePrograma} = req.body
    try {
        informacion = convertirClavesAMayusculas(informacion);
        //validarFormato(formato);
        const buscarPrograma = await buscarProgramaByName(nombrePrograma);

        if( buscarPrograma ){
             throw new Error("Ya existe un programa con el nombre: " + nombrePrograma);
        }

        const programa = crearInstanciaPrograma({nombrePrograma, informacion}, colaborador);
        await guardarPrograma(programa);

        const programaDto = programaToProgramaDto(programa, colaborador);
        return res.status(201).json({
            msg: "Programa creado correctamente",
            programa: programaDto,
        });

    } catch (error) {

        let errorMessage = error.message;

        return res.status(400).json({
            msg: "Error al crear el programa",
            error: error.message
        });
    }
};


//Obtener lista de programas activos para los lideres de proyectos.
const obtenerListaProgramas = async (req, res) => {

    const {tokenAcessoRenovado} = req;
    let { page } = req.query;
    const limit = 10;
    const desde = (page-1) * limit;

    try {
        const paginasDisponibles = await getPagesAvalaible(Programa, {estado:"ACTIVO"}, limit, page);

        const programas = await obtenerProgramas(desde, limit);
        const programasDto = await programasToProgramasDtos(programas);

        if(tokenAcessoRenovado){
            return res.json({
                pagina: `pagina ${page} de ${paginasDisponibles}`,
                msg: `se encontraron ${programas.length} programas`,
                programas: programasDto,
                tokenAcessoRenovado
            })
        }
        return res.json({
            pagina: `pagina ${page} de ${paginasDisponibles}`,
            msg: `se encontraron ${programas.length} programas`,
            programas: programasDto
        })
    } catch (error) {
        return res.status(400).json({
            msg: "Error al obtener los programas",
            error: error.message
        })
    }
};

//obtener lista de programas en estado: "EN PROCESO DE CONFIRMACION" para los roles de directora
const obtenerProgramasEnEspera = async (req, res) => {

    const {tokenAcessoRenovado} = req;
    //let { page } = req.query;
    //const limit = 1;
    //const desde = (page-1) * limit;

    try {

        const programas = await obtenerProgramaConfirmacion();
        console.log("Programas obtenidos después de la validación:", programas);  // Verificar los programas después de obtener

        const programasDto = await programasToProgramasDtos(programas);
        console.log("Programas mapeados:", programasDto);

        if(tokenAcessoRenovado){
            return res.json({
                //pagina: `pagina ${page} de ${paginasDisponibles}`,
                msg:`Se encontraron ${programas.length} en espera a ser confirmados`,
                programas: programasDto,
                tokenAcessoRenovado
            })
        }
        return res.json({
            //pagina: `pagina ${page} de ${paginasDisponibles}`,
            msg:`Se encontraron ${programas.length} en espera a ser confirmados`,
            programas: programasDto,
        })
    } catch (error) {
        return  res.status(400).json({
            msg: "Error al obtener la lista de programas en espera de confirmacion",
            error: error.message
        })
    }
}

const actualizarPrograma = async (req, res) => {
    let {programa, body: datos} = req;
    try {
        datos.informacion = convertirClavesAMayusculas(datos.informacion);
        validarclaves(programa.informacion, datos.informacion);
        if( objetosIguales(programa.informacion, datos.informacion) ) {
            throw new Error(`no has realizado ningun cambio en el objeto`)
        };
        await updatePrograma(programa, datos);
        const colaborador = await buscarColaboradorByIdOrDocumento(programa.colaboradorCreador);
        const programaActualizado = await guardarPrograma(programa);
        const colaboradorAsignado = await buscarColaboradorByIdOrDocumento(programa.colaboradorResponsable);
        const programaDto = programaToProgramaDto(programaActualizado, colaborador, colaboradorAsignado);
        return res.json({
            msg: "El programa ha sido actualizado correctamente",
            programa: programaDto
        })
    } catch (error) {
        return res.status(400).json({
            msg: "Error al actualizar el programa",
            error: error.message
        })
    }
};

const desactivarPrograma= async(req, res) => {
    let {programa} = req;
    try {
        await updatePrograma(programa, {estado: "DESACTIVAR"});
        const programaDesactivado = await guardarPrograma(programa);
        const colaborador = await buscarColaboradorByIdOrDocumento(programa.colaborador);
        const colaboradorAsignado = await buscarColaboradorByIdOrDocumento(programa.colaboradorResponsable);
        const programaDto = programaToProgramaDto(programaDesactivado, colaborador, colaboradorAsignado);
        return res.json({
            msg: "Programa desactivado correctamente",
            programa: programaDto
        })
    } catch (error) {
        return res.status(400).json({
            msg: "Error al desactivar el formato",
            error: error.message
        })
    }
}

/*activar programas mediante la asignación de colaboradores. Evaluación y Activación de Programas en el CDC -super historia*/
const activarPrograma = async (req, res) => {
    let {programa} = req;
    try {
        if(programa.estado === "ACTIVO") throw new Error('El programa ya se encuentra activo');
        await updatePrograma(programa, {estado: "ACTIVAR"});

        const programaActivado = await guardarPrograma(programa);
        const colaborador = await buscarColaboradorByIdOrDocumento(programa.colaborador);
        const colaboradorAsignado = await buscarColaboradorByIdOrDocumento(programa.colaboradorResponsable);

        if (!colaboradorAsignado.email) {
            throw new Error('El colaborador asignado no tiene un correo electrónico registrado');
        }

        //enviar notificaciones por correo
        await enviarCorreo({
            to: colaboradorAsignado.email,

            subject: `Asignación de programa: ${programa.nombrePrograma}`,
            text: `Hola ${colaboradorAsignado.nombreColaborador}, se te ha asignado como responsable del programa "${programa.nombrePrograma}".`,
            html: `<p>Hola <strong>${colaboradorAsignado.nombreColaborador}</strong>,</p>
                   <p>Se te ha asignado como responsable del programa <strong>"${programa.nombrePrograma}"</strong>.</p>`,

        });

        const programaDto = programaToProgramaDto(programaActivado, colaborador, colaboradorAsignado);
        return res.json({
            msg: "Programa activado correctamente",
            programa: programaDto
        })
    } catch (error) {
        return res.status(400).json({
            msg: "Error al activar el programa",
            error: error.message
        })
    }
};
/*confirmar programas mediante la asignación de colaboradores. Evaluación y Activación de Programas en el CDC -super historia*/
const confirmaPrograma = async (req, res) => {
    let {programa, colaborador: colaboradorAsignado, body:datos} = req;
    try {
        validarFormato(datos);
        if(programa.estado === "ACTIVO") throw new Error("El programa ya ha sido validado y confirmado");

        await updatePrograma(programa, {estado: "CONFIRMAR"});
        programa.colaboradorResponsable = colaboradorAsignado.idColaborador;
        programa.formato = datos;

        const programaActivado = await guardarPrograma(programa);
        const colaborador = await buscarColaboradorByIdOrDocumento(programa.colaboradorCreador);

        //enviar notificación por correo
        await enviarCorreo({
            to: colaboradorAsignado.email,
            subject: `Confirmación de responsabilidad en el programa: ${programa.nombrePrograma}`,
            text: `Hola ${colaboradorAsignado.nombreColaborador}, ahora eres el responsable del programa "${programa.nombrePrograma}".`,
            html: `<p>Hola <strong>${colaboradorAsignado.nombreColaborador}</strong>,</p>
                   <p>Ahora eres el responsable del programa <strong>"${programa.nombrePrograma}"</strong>.</p>`,

        });


        const programaDto = programaToProgramaDto(programaActivado, colaborador, colaboradorAsignado);
        return res.json({
            msg: "Programa confirmado correctamente, se asigno correctamnete el colaborador responsable y se asigno el formato",
            programa: programaDto
        })
    } catch (error) {
        return res.status(400).json({
            msg: "Error al confirmar el programa",
            error: error.message,
        })
    }
};

// Controlador para enviar un correo
const enviarCorreoController = async (req, res) => {
    const { to, subject, text, html } = req.body;

    // Validar que los parámetros necesarios estén presentes
    if (!to || !subject || (!text && !html)) {
        return res.status(400).json({
            message: 'Faltan parámetros obligatorios: to, subject, y al menos text o html',
        });
    }

    try {
        // Llamar al helper para enviar el correo
        await enviarCorreo({ to, subject, text, html });
        res.status(200).json({ message: 'Correo enviado exitosamente' });
    } catch (error) {
        res.status(500).json({
            message: 'Error al enviar el correo',
            error: error.message,
        });
    }
};

//endpoint antiguo inactivo
// const crearFormatoPrograma = async (req, res) => {
//     let {programa, body: datos} = req;
//     try {
//         validarFormato(datos);
//         programa.formato = datos;
//         await guardarPrograma(programa);
//         const colaborador = await buscarColaboradorByIdOrDocumento(programa.colaboradorCreador);
//         const programaDto = programaToProgramaDto(programa, colaborador);
//         return res.status(201).json({
//             msg: "El formato a sido añadido correctamente al programa",
//             programa: programaDto
//         })
//     } catch (error) {
//         return res.status(400).json({
//             msg: "Error al crear el formato del programa",
//             error: error.message
//         })
//     }
// }




module.exports = {
    actualizarPrograma,
    activarPrograma,
    crearPrograma,
    confirmaPrograma,
    desactivarPrograma,
    obtenerListaProgramas,
    obtenerProgramasEnEspera,
    enviarCorreoController
}