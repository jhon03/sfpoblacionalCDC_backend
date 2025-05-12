const { RegistroNecesidad } = require("../../dominio/models");
const Colaborador = require('../../dominio/models/colaborador.models');
const ContadorItem = require("../../dominio/models/contadorItem.model");
//Crear nuevo registro de necesidades
const crearRegistroNecesidad = async (req, res) => {

  const { necesidades } = req.body;

    try {

    if (!necesidades || !Array.isArray(necesidades) || necesidades.length === 0) {
        return res.status(400).json({ message: 'Se requiere al menos una necesidad registrada' });
      }

    // Obtener y actualizar el contador de items
    const contador = await ContadorItem.findOneAndUpdate(
      { tipo: 'necesidad' }, // Tipo para el contador (podemos tener múltiples contadores si lo necesitas)
      { $inc: { valor: 1 } }, // Incrementamos el contador en 1
      { new: true, upsert: true } // Si no existe, lo crea
    );
// Verificar si alguna necesidad ya existe en la base de datos
for (let i = 0; i < necesidades.length; i++) {
  const necesidad = necesidades[i];

  // Buscar necesidad similar en la base de datos
  const necesidadExistente = await RegistroNecesidad.findOne({
    "necesidades.necesidadIdentificada": necesidad.necesidadIdentificada,
    "necesidades.causas": necesidad.causas,
    "necesidades.impacto": necesidad.impacto,
    "necesidades.poblacionAfectada": necesidad.poblacionAfectada,
    "necesidades.prioridad": necesidad.prioridad,
    "necesidades.recursosNecesarios": necesidad.recursosNecesarios,
    "necesidades.estrategiasIntervencion": necesidad.estrategiasIntervencion,
    "necesidades.indicadoresExito": necesidad.indicadoresExito
  });

  if (necesidadExistente) {
    return res.status(400).json({ message: 'Ya existe un registro de necesidad similar.' });
  }
}


      const nuevoRegistro = new RegistroNecesidad({
        necesidades: necesidades.map((necesidad) => ({
          ...necesidad,
          item: contador.valor ,// Asignamos el valor del contador al campo "item"
          
        }))

      });

      await nuevoRegistro.save();

      res.status(201).json({ message: "Registro de necesidades creado exitosamente.",
        registro: nuevoRegistro
       });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al crear el registro de necesidades.", error });
      res.status(500).json({message: 'Error interno del servidor', error: error.message});
    }
  };

  // Obtener todos los registros
const obtenerRegistrosNecesidad = async (req, res) => {
  try {
    const registros = await RegistroNecesidad.find().sort({ fechaRegistro: -1 });

    res.status(200).json({
      message: 'Registros obtenidos correctamente',
      registros
    });
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

// Actualizar registro de necesidades
const actualizarRegistroNecesidad = async (req, res) => {
  const { id } = req.params; // ID del registro a actualizar
  const { necesidades } = req.body; // Nuevas necesidades

  try {
    if (!necesidades || !Array.isArray(necesidades) || necesidades.length === 0) {
      return res.status(400).json({ message: 'Se requiere al menos una necesidad registrada' });
    }

    // Verificar si alguna necesidad ya existe en el registro de necesidad
    for (let i = 0; i < necesidades.length; i++) {
      const necesidad = necesidades[i];

      // Buscar necesidad similar en la base de datos
      const necesidadExistente = await RegistroNecesidad.findOne({
        "necesidades.necesidadIdentificada": necesidad.necesidadIdentificada,
        "necesidades.causas": necesidad.causas,
        "necesidades.impacto": necesidad.impacto,
        "necesidades.poblacionAfectada": necesidad.poblacionAfectada,
        "necesidades.prioridad": necesidad.prioridad,
        "necesidades.recursosNecesarios": necesidad.recursosNecesarios,
        "necesidades.estrategiasIntervencion": necesidad.estrategiasIntervencion,
        "necesidades.indicadoresExito": necesidad.indicadoresExito
      });

      if (necesidadExistente) {
        return res.status(400).json({ message: 'Ya existe un registro de necesidad similar.' });
      }
    }

    // Obtener y actualizar el contador de items
    const contador = await ContadorItem.findOneAndUpdate(
      { tipo: 'necesidad' },
      { $inc: { valor: 1 } },
      { new: true, upsert: true } // Si no existe, lo crea
    );

    // Buscar el registro de necesidad a actualizar
    const registroExistente = await RegistroNecesidad.findById(id);

    if (!registroExistente) {
      return res.status(404).json({ message: 'Registro de necesidad no encontrado' });
    }

    // Actualizar las necesidades del registro
    registroExistente.necesidades = necesidades.map((necesidad) => ({
      ...necesidad,
      item: contador.valor // Asignamos el valor del contador al campo "item"
    }));

    // Guardar el registro actualizado
    await registroExistente.save();

    res.status(200).json({
      message: "Registro de necesidades actualizado exitosamente.",
      registro: registroExistente
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el registro de necesidades.", error });
  }
};

// Eliminar un registro
const eliminarRegistro = async (req, res) => {
  try {
    const { id } = req.params;

    const registro = await RegistroNecesidad.findByIdAndDelete(id);
    if (!registro) {
      return res.status(404).json({ message: 'Registro no encontrado para eliminar' });
    }

    res.status(200).json({
      message: 'Registro eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar el registro:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

  module.exports = {
    crearRegistroNecesidad,
    obtenerRegistrosNecesidad,
    actualizarRegistroNecesidad,
    eliminarRegistro
  };