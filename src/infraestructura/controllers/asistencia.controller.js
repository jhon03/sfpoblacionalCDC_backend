const { Asistencia } = require("../../dominio/models");
const FormulariosProgramas = require("../../dominio/models/formularioPrograma.model");
const Programas = require("../../dominio/models/programa.models");

const registrarAsistencia = async (req, res) => {
  try {
    const { numeroDocumento, nombreActividad } = req.body;


   const formulario = await FormulariosProgramas.findOne({
      "valoresDiligenciados.valores": {
        $elemMatch: {
          nombreCampo: { $regex: /(número|numero|c[eé]dula)/i },
          valor: numeroDocumento
        }
      }
    });

    if (!formulario) {
      return res.status(404).json({ message: 'Participante no encontrado' });
    }

    // Buscar el bloque del participante
    const participante = formulario.valoresDiligenciados.find(item =>
      item.valores.some(v =>
        /(número|numero|c[eé]dula)/i.test(v.nombreCampo) && v.valor === numeroDocumento
      )
    );

    if (!participante) {
      return res.status(404).json({ message: 'Participante no encontrado en valoresDiligenciados' });
    }

    //  Buscar el campo que tenga el nombre del participante (nombreCampo flexible)

    const campoNombre = participante.valores.find(val =>
      /nombre/i.test(val.nombreCampo)
    );

    const nombreParticipante = campoNombre?.valor;

    if (!nombreParticipante) {
      return res.status(400).json({ message: 'Nombre del participante no encontrado' });
    }

   // Normalizar el nombre de la actividad antes de guardar
    const normalizarTexto = (texto) => {
      return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, '');
    };


    const actividadNormalizada = normalizarTexto(nombreActividad);

    const nuevaAsistencia = new Asistencia({
      participanteNombre: nombreParticipante,
      numeroDocumento,
    actividadNombre: actividadNormalizada, //  AQUI SE GUARDA NORMALIZADO
      programaId: formulario.programaId,
      nombrePrograma: formulario.nombrePrograma,

    });

    await nuevaAsistencia.save();

    res.status(201).json({ message: 'Asistencia registrada correctamente.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar la asistencia.' });
  }
};

const contarAsistentesPorActividad = async (req, res) => {
  try {
    const { nombreActividad } = req.params;

 // Normalización consistente con registrarAsistencia
    const normalizar = (texto) =>
      texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "");

    const nombreNormalizado = normalizar(nombreActividad);
// Busca por el campo ya normalizado
    const total = await Asistencia.countDocuments({
      actividadNombre: nombreNormalizado
    });

 res.status(200).json({ actividad: nombreNormalizado, totalAsistentes: total });
    //const total = await Asistencia.countDocuments({ actividadNombre: nombreActividad });

    //res.status(200).json({ actividad: nombreActividad, totalAsistentes: total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al contar asistentes.' });
  }
};

//Obtener totales de asistentes por actividades para gráfica//comentario para volver a subir a railway
const obtenerTotalesPorActividades = async (req, res) => {
  try {
    const totales = await Asistencia.aggregate([
      {
        $group: {
          _id: "$actividadNombre",
          totalAsistentes: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          actividad: "$_id",
          totalAsistentes: 1
        }
      }
    ]);

    res.status(200).json(totales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los totales por actividades.' });
  }
};

module.exports = {
  registrarAsistencia,
  contarAsistentesPorActividad,
  obtenerTotalesPorActividades
};
