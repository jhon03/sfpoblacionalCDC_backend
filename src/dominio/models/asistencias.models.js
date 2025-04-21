const { model, Schema } = require('mongoose');

const asistenciaSchema = Schema({

  participanteNombre:
   { type: String,
    required: [true, 'El nombre del participante es requerido']
   },
    numeroDocumento:
      { type: String,
         required: [true,]
         },
  actividadNombre:
   { type: String,
    required: [true, 'La nombre de la actividad es requerido']
},
  programaId: { type: String,
  required: [true, 'El id del programa es requerido']
},

  fechaHora: { type: Date,
     default: Date.now },

  /*registradoPor: {
    type: String,
    required: true
}*/ // ID del líder del programa
});

module.exports = model('Asistencia', asistenciaSchema);
