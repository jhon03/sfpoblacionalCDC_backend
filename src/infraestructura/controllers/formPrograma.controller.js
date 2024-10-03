

const { FormularioPrograma} = require("../../dominio/models");
const Programa = require('../../dominio/models/programa.models')
const {v4: uuidv4} = require('uuid');
const Colaborador = require('../../dominio/models/colaborador.models')

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

// se busca el programa por nombrePrograma 
const programa = await Programa.findOne({  nombrePrograma})
      if (!programa) {
        return res.status(404).json({ error: ' Programa no encontrado'});

      }
//VERIFICA si ya existe un formulario para este programa
const formularioExistente = await FormularioPrograma.findOne({programaId: programa._id});

if( formularioExistente ){
  return res.status(400).json({ error: 'Este programa ya tiene un formulario asociado'})
}
  
      //crea el formulario con los campos adicionales
      const formulario = new FormularioPrograma
      ({programaId: programa._id, idFormulario: uuidv4(), campos, nombrePrograma: programa.nombrePrograma,
        estado: 'ACTIVO',
       colaboradorId: colaborador._id
      });

      await formulario.save();


      res.status(201).json({ message: 'formulario creado exitosamente', formulario});
    } catch (error) {
      console.error('Error al crear el formulario:', error); // Log completo del error
      res.status(500).json({ error: 'Error al crear el formulario', detalles: error.message });
    }

      
      //const { programaId, campos } = req.body;
     
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
    const { valores } = req.body;

    try {
        // Se verifica que el formulario exista
        const formulario = await FormularioPrograma.findOne({ idFormulario });

        if (!formulario) {
            return res.status(404).json({ error: 'Formulario no encontrado' });
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

         // Se agrega un nuevo conjunto de valores diligenciados al formulario
         formulario.valoresDiligenciados.push({
          valores: valoresDiligenciados,
          fechaDiligencia: new Date()
      });
         // Se guarda el formulario con los nuevos valores
         await formulario.save();
         res.status(200).json({ message: 'Formulario diligenciado correctamente', formulario });
 

    } catch (error) {
        console.error('Error al diligenciar el formulario:', error);
        res.status(500).json({ error: 'Error al diligenciar el formulario', detalles: error.message });
    }
};

/*const obtenerFormulariooPorId = async (req, res) => {
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
};*/

const obtenerFormulariosPorNombrePrograma = async (req, res) => {
  const { nombrePrograma } = req.params; // Obtiene el nombre del programa de los parámetros de la URL

  try {
    // Busca los formularios por nombre de programa
    const formularios = await Formulario.find({ nombrePrograma });

    if (!formularios || formularios.length === 0) {
      return res.status(404).json({ message: 'No se encontraron formularios para el programa especificado.' });
    }

    // Formatear la respuesta incluyendo los campos y los valores diligenciados
    const respuesta = formularios.map(formulario => ({
      idFormulario: formulario.idFormulario,
      programaId: formulario.programaId,
      nombrePrograma: formulario.nombrePrograma,
      colaboradorId: formulario.colaboradorId,
      estado: formulario.estado,
      campos: formulario.campos.map(campo => ({
        nombre: campo.nombre,
        tipo: campo.tipo
      })),
      valoresDiligenciados: formulario.valoresDiligenciados.map(valor => ({
        nombreCampo: valor.valores[0]?.nombreCampo,
        valor: valor.valores[0]?.valor,
        fechaDiligencia: valor.fechaDiligencia
      })),
      fechaCreacion: formulario.fechaCreacion
    }));

    return res.status(200).json(respuesta);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener los formularios.', error });
  }
};
    
  module.exports = {
    crearFormularioPrograma,
    obtenerFormularioPorId,
    diligenciarFormularioPrograma,
    obtenerFormulariosPorNombrePrograma
  }
    