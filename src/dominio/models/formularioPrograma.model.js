//const mongoose = require('mongoose');


const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');

const FormularioProgramaSchema = new mongoose.Schema({



   idFormulario: {
    type: String,
    default: uuidv4
   },

   programaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Programa',
    required: true // Asegura que sea requerido
  },

   nombrePrograma: {
    type: String,
    required: true
   },

colaboradorId: {
  type: String,
  required: true
},


estado: {
  type: String,
  default: "ACTIVO"
},
    campos: [
      {
        nombre: { type: String, required: true },
        tipo: { type: String, required: true }  // Ej: 'string', 'number', etc.
      }
    ],
    // Array oara almacenar múltiples conjuntos de valores diligenciados
    valoresDiligenciados: [
      {
        fechaDiligencia: {  type: Date,
          default: Date.now,
          get: function (value){
           return value.toLocaleString('es-ES', {
            day: 'numeric',
            month: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      second: 'numeric',
                      hour12: true
           });
          }
        },
        valores: [
          {
            nombreCampo: { type: String, required: true},
            valor: { type: mongoose.Schema.Types.Mixed, required: true}
          }
        ]
      }
    ],
    fechaCreacion: {
      type: Date,
      default: Date.now,
      get: function (value){
       return value.toLocaleString('es-ES', {
        day: 'numeric',
        month: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                  hour12: true
       });
      }
  }
  }, {
    toJSON: { getters: true }
  });

  const FormularioPrograma = mongoose.model('FormularioPrograma', FormularioProgramaSchema);

  module.exports = FormularioPrograma;

