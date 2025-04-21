const { Asistencia } = require("../../dominio/models");
const FormulariosProgramas = require("../../dominio/models/formularioPrograma.model");
const Programas = require("../../dominio/models/programa.models");

const registrarAsistencia = async (req, res) => {
  try {
    const { numeroDocumento, nombreActividad } = req.body;

    //const registradoPor= req.userSession.idColaborador; // Usuario autenticado desde el token

    /*console.log('Registrado por:', registradoPor); // Log para verificar el uuid
    if (!registradoPor) {
      return res.status(400).json({ message: 'No se pudo obtener el identificador del usuario autenticado' });
    }*/
    // Buscar participante por número de documento (nombreCampo flexible)
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

    const nuevaAsistencia = new Asistencia({
      participanteNombre: nombreParticipante,
      numeroDocumento,
      actividadNombre: nombreActividad,
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

    const total = await Asistencia.countDocuments({ actividadNombre: nombreActividad });

    res.status(200).json({ actividad: nombreActividad, totalAsistentes: total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al contar asistentes.' });
  }
};

module.exports = {
  registrarAsistencia,
  contarAsistentesPorActividad
};
