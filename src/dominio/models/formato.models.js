const { model, Schema } = require('mongoose');

const formatoSchema = Schema({

    idFormato: {
        type: String,
        required: [true, 'El id del programa es requerido']
    },

    colaborador: {
        type: String,
        required: [true, 'El colaborador es requerido']
    },

    nombreFormato : {
        type: String,
        requried: [true, 'El nombre del formato es requerido']
    },

    formato: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
      }

});

//modificar metodo json respuesta
formatoSchema.methods.toJSON = function(){
    const { __v, _id, ...formato} = this.toObject();
    return formato;
}

module.exports = model('Formato', formatoSchema);

