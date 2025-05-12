
const { model, Schema } = require ('mongoose');

const necesidadSchema = new Schema({


    necesidades: [

        {
            item: { type: Number, required: true },

            necesidadIdentificada:
            { type: String, required: true },

            causas: {
                type: String, required: true },

            impacto: {
                type: String, required: true },

            poblacionAfectada: {
                type: String, required: true },

            prioridad: { type: String, required: true },

            recursosNecesarios:
             { type: String, required: true },

            estrategiasIntervencion: { type: String, required: true },

            indicadoresExito: { type: String, required: true }
        }
    ],
  
    fechaRegistro: { type: Date, default: Date.now }
});

module.exports = model('RegistroNecesidad', necesidadSchema);