
const { response, request } = require('express');
const {FormularioPrograma} = require('../../dominio/models');
const Programa = require('../../dominio/models/programa.models')
const {v4: uuidv4} = require('uuid');
const Colaborador = require('../../dominio/models/colaborador.models')
const { enviarCorreo } = require('../helpers/email.helpers');
// Controlador para crear un formulario de programa
const crearFormularioPrograma = async (req, res) => {
  let correoEnviado = false; // Variable para rastrear el envío del correo

  //se modifico el idPrograma por nombrePrograma para pasarlo al crear el formulario.
  const { nombrePrograma, campos} = req.body;
  const { colaboradorId} = req.params;
    try {

//verifico que exista el colaborador que creara el formulario
const colaborador = await Colaborador.findOne({idColaborador: colaboradorId});


if (!colaborador){
  return res.status(404).json({ error: 'Colaborador no enconrado'});
}

// se busca el programa "ACTIVO" por nombrePrograma
const programa = await Programa.findOne({  nombrePrograma, estado: 'ACTIVO'});
      if (!programa) {
        return res.status(404).json({ error: ' Programa no encontrado'});

      }
//VERIFICA si ya existe un formulario para este programa
const formularioExistente = await FormularioPrograma.findOne({programaId: programa.idPrograma});

if( formularioExistente ){
  return res.status(400).json({ error: 'Este programa ya tiene un formulario asociado'})
}

//Buscar al colaborador responsable del programa
const colaboradorResponsable = await Colaborador.findOne({ idColaborador: programa.colaboradorResponsable});
if (!colaboradorResponsable){
  return rest.status(404).json({error: 'No se encontro colaborador Responsable'});
}
      //crea el formulario con los campos adicionales
      const formulario = new FormularioPrograma
      ({programaId: programa.idPrograma,
        idFormulario: uuidv4(),
         campos, nombrePrograma: programa.nombrePrograma,
        estado: 'ACTIVO',
      colaboradorId: colaborador._id
      //colaboradorId: colaboradorCreador._id,
      });

      await formulario.save();
//Enviar notificación por correo al colaborador responsable
if (colaboradorResponsable.email) {
  await enviarCorreo({
    to: colaboradorResponsable.email,
    subject: `Nuevo formulario asignado al programa: ${programa.nombrePrograma}`,
        text: `Hola ${colaboradorResponsable.nombreColaborador}, se ha asignado un formulario al programa "${programa.nombrePrograma}" para recopilar datos de los participantes que se inscribirán.`,
        html: `<p>Hola <strong>${colaboradorResponsable.nombreColaborador}</strong>,</p>
               <p>Se ha asignado un formulario al programa <strong>"${programa.nombrePrograma}"</strong> para recopilar datos de los participantes que se inscribirán.</p>`,

  });
}else {
  console.warn(`El colaborador responsable (${colaboradorResponsable.nombreColaborador}) no tiene un correo electrónico registrado.`);

}

      res.status(201).json({ message: 'formulario creado exitosamente', formulario});
    } catch (error) {
      console.error('Error al crear el formulario:', error); // Log completo del error
      res.status(500).json({ error: 'Error al crear el formulario', detalles: error.message });

    }


  };

  const obtenerFormularioPorId = async (req, res) => {
    const {idPrograma, idFormulario} = req.params;


    try {
      //verifica si el programa existe
      const programa = await Programa.findOne({ idPrograma});
      if (!programa) {
        return res.status(404).json({error: 'Programa no encontrado'});
      }

      const formulario = await FormularioPrograma.findOne({idFormulario,
        programaId: programa._id
      });

      if (!formulario){
        return res.status(404).json({ error: 'Formulario no encontrado para este programa'});
      }
      //responde con el formulario encontrado
      res.status(200).json({formulario});
    } catch (error) {
      console.error('error al obtener el formulario', error);
      res.status(500).json({ error: 'Error al obtener el formulario', detalles: error.message});
    }
  };


// Diligenciar formulario, obteniéndolo por nombre de programa
const diligenciarFormulario = async (req, res) => {
  try {
    const { nombrePrograma, valores } = req.body;

    // Validación de campos requeridos
    if (!nombrePrograma || !valores || !Array.isArray(valores)) {
      return res.status(400).json({
        ok: false,
        msg: 'El nombre del programa y los valores son obligatorios.',
      });
    }

    // Buscar el formulario por nombre del programa
    const formulario = await FormularioPrograma.findOne({nombrePrograma: nombrePrograma});

    if (!formulario) {
      return res.status(404).json({
        ok: false,
        msg: 'Formulario no encontrado para el programa indicado.',
      });
    }

    // Validar que los campos enviados coincidan con los definidos en el formulario
    const camposValidos = formulario.campos.map(campo => campo.nombre);
    const valoresInvalidos = valores.filter(v => !camposValidos.includes(v.nombreCampo));

    if (valoresInvalidos.length > 0) {
      return res.status(400).json({
        ok: false,
        msg: 'Uno o más campos no son válidos para este formulario.',
        invalidFields: valoresInvalidos.map(v => v.nombreCampo),
      });
    }
    //validar valores duplicados
    const valoresDuplicados = valores.filter(v => {
      return formulario.valoresDiligenciados.some(diligenciado => diligenciado.valores.some(
        valor => valor.nombreCampo === v.nombreCampo &&
        valor.valor == v.valor
      )
      );
    });
    if ( valoresDuplicados.length > 0){
      return res.status(400).json({
        ok: false,
        msg: 'Uno o más valores ya existen en los datos diligenciados',
        duplicados: valoresDuplicados.map((v) => ({
          nombreCampo: v.nombreCampo,
        valor: v.valor,
      })),
      });
    }

    // Estructurando los valores diligenciados con la fecha y los valores
    const fechaDiligencia = new Date();


    const valoresDiligenciados = valores.map(v => ({
      nombreCampo: v.nombreCampo,
      valor: v.valor,
    }));

    // Agregar los valores diligenciados con la fecha
    formulario.valoresDiligenciados.push({ fechaDiligencia, valores: valoresDiligenciados });

    // Guardar los cambios en la base de datos
    await formulario.save();

    res.json({
      ok: true,
      msg: 'Formulario diligenciado exitosamente.',
      formulario: formulario, // Retornar el formulario actualizado
    });

  } catch (error) {
    console.error('Error al diligenciar formulario:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error interno del servidor.',
    });
  }
};


//se obtiene un formulario por id de formulario
const obtenerFormulariooPorId = async (req, res) => {
  const { idFormulario } = req.params;

  try {
      const formulario = await FormularioPrograma.findOne({ idFormulario }).populate('campos'); // Asegúrate de usar populate si necesitas datos de otros modelos
      if (!formulario) {
          return res.status(404).json({ error: 'Formulario no encontrado' });
      }
      res.status(200).json(formulario);
  } catch (error) {
      console.error('Error al obtener el formulario:', error);
      res.status(500).json({ error: 'Error al obtener el formulario', detalles: error.message });
  }
};

const buscarFormulariosPorNombrePrograma = async (req, res) => {

  try {
    const { nombrePrograma } = req.query; // Tomamos el nombre del programa desde los query params

    if (!nombrePrograma) {
      return res.status(400).json({
        ok: false,
        msg: 'El nombre del programa es requerido como parámetro de búsqueda',
      });
    }

    // Buscar el formulario por nombrePrograma
    const formulario = await FormularioPrograma.findOne({ nombrePrograma });

    if (!formulario) {
      return res.status(404).json({
        ok: false,
        msg: `No se encontró un formulario asociado al programa: ${nombrePrograma}`,
      });
    }

    // Devolver el formulario encontrado
    res.json({
      ok: true,
      formulario,
    });
  } catch (error) {
    console.error('Error al buscar formulario:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error interno del servidor',
    });
  }
};


  module.exports = {
    crearFormularioPrograma,
    obtenerFormularioPorId,
    buscarFormulariosPorNombrePrograma,
    obtenerFormulariooPorId,
    diligenciarFormulario
  }
