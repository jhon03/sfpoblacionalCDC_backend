
const { response, request } = require('express');
const {FormularioPrograma} = require('../../dominio/models');
const Programa = require('../../dominio/models/programa.models')
const {v4: uuidv4} = require('uuid');
const Colaborador = require('../../dominio/models/colaborador.models')
const { enviarCorreo } = require('../helpers/email.helpers');
// Controlador para crear un formulario de programa
const crearFormularioPrograma = async (req, res) => {

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
  const diligenciarFormularioPrograma = async (req, res) => {

    const { idFormulario } = req.params;
    const { colaboradorId} = req.params;
    const { valores} = req.body;
// Agregar el log para ver el ID del colaborador recibido
console.log('Colaborador ID recibido:', colaboradorId);

    try {

   //verificar que exista el colaborador que diligenciara el formulario
   const colaborador = await Colaborador.findOne({
    idColaborador: colaboradorId // Asegúrate de que este sea el campo correcto
});

if (!colaborador){
  return res.status(404).json({ error: 'Colaborador no enconrado'});
}

      // Se verifica que el formulario exista
        const formulario = await FormularioPrograma.findOne({ idFormulario });

        if (!formulario) {
            return res.status(404).json({ error: 'Formulario no encontrado' });
        }
// Asegúrate de que 'valores' sea un array
if (!Array.isArray(valores)) {
  return res.status(400).json({ error: 'Los valores deben ser un array' });
}

        // Validar que no existan valores duplicados en 'valoresDiligenciados'
        const valoresDuplicados = formulario.valoresDiligenciados.some((conjuntoValores) => {
          return conjuntoValores.valores.some(campoExistente =>
              valores.some(campoNuevo =>
                  campoNuevo.nombreCampo === campoExistente.nombreCampo && campoNuevo.valor === campoExistente.valor
              )
          );
      });

        if (valoresDuplicados) {
            return res.status(400).json({ error: 'Ya existe un conjunto de valores duplicados' });
        }

        // Se valida cada campo contra los tipos definidos en el formulario
        const camposFormulario = formulario.campos;
        const valoresDiligenciados = [];

        for (let valorCampo of valores) {
            const campoFormulario = camposFormulario.find(campo => campo.nombre === valorCampo.nombreCampo);

            if (!campoFormulario) {
                return res.status(400).json({ error: `Campo ${valorCampo.nombreCampo} no existe en el formulario` });
            }

            // Valida el tipo de valor (string o number)
            if (campoFormulario.tipo === 'string' && typeof valorCampo.valor !== 'string') {
                return res.status(400).json({ error: `El campo ${valorCampo.nombreCampo} debe ser un string` });
            }
            if (campoFormulario.tipo === 'number' && typeof valorCampo.valor !== 'number') {
                return res.status(400).json({ error: `El campo ${valorCampo.nombreCampo} debe ser un número` });
            }

             // Se agrega el valor a la lista de valores diligenciados
             valoresDiligenciados.push({
              nombreCampo: valorCampo.nombreCampo,
              valor: valorCampo.valor
          });
        }
// Asignar el colaboradorId al formulario
formulario.colaboradorId = colaboradorId;

         // Se agrega un nuevo conjunto de valores diligenciados al formulario
         formulario.valoresDiligenciados.push({
          valores: valoresDiligenciados,
          fechaDiligencia: new Date()
      });


         //formulario.valores = valoresDiligenciados;
         // Se guarda el formulario con los nuevos valores
         await formulario.save();
         res.status(200).json({ message: 'Formulario diligenciado correctamente', formulario });


    } catch (error) {
        console.error('Error al diligenciar el formulario:', error);
        res.status(500).json({ error: 'Error al diligenciar el formulario', detalles: error.message });
    }
};

// Diligenciar formulario, obteniéndolo por nombre de programa
const diligenciarFormulario = async (req, res) => {
  const { nombrePrograma } = req.query; // Obtener el nombrePrograma desde los parámetros de consulta
  const { valores } = req.body; // Capturar los valores diligenciados desde el cuerpo de la solicitud

  try {
    if (!nombrePrograma) {
      return res.status(400).json({
        msg: 'El nombre del programa es requerido como parámetro de consulta.',
      });
    }

    //Buscar el programa por nombre
    const programa = await Programa.findOne({ nombrePrograma });
    if (!programa) {
      return res.status(404).json({
        msg: `No se encontró ningún programa con el nombre: ${nombrePrograma}`,
      });
    }

//verificar que el usuario logueado sea el colaborador responsable del programa
const usuario = req.userSession;
if(programa.colaboradorResponsable.trim() !== usuario.colaborador.trim()){
  return res.status(403).json({
    msg: "No tienes permisos para diligenciar el formulario",
  });
}

    // Buscar el formulario asociado al programa
    const formulario = await FormularioPrograma.findOne({ nombrePrograma });

    if (!formulario) {
      return res.status(404).json({
        msg: `No se encontró ningún formulario asociado al programa: ${nombrePrograma}`,
      });
    }

    // Validar que los valores enviados correspondan a los campos del formulario
    const camposValidos = formulario.campos.map((campo) => campo.nombre);
    const valoresInvalidos = valores.filter(
      (valor) => !camposValidos.includes(valor.nombreCampo)
    );

    if (valoresInvalidos.length > 0) {
      return res.status(400).json({
        msg: 'Algunos campos enviados no son válidos para este formulario.',
        valoresInvalidos,
      });
    }

    // Agregar los valores diligenciados al formulario
    formulario.valoresDiligenciados.push({
      fechaDiligencia: new Date(),
      valores,
      //colaboradorId: usuario.colaborador,
      //colaboradorNombre: usuario.nombreUsuario,
    });

    // Guardar el formulario actualizado
    await formulario.save();

    res.json({
      msg: 'Formulario diligenciado correctamente.',
      formulario,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al diligenciar el formulario.',
      error: error.message,
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
    diligenciarFormularioPrograma,
    buscarFormulariosPorNombrePrograma,
    obtenerFormulariooPorId,
    diligenciarFormulario
  }
