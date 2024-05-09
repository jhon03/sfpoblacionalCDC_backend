const {model, Schema, default: mongoose} = require('mongoose');

const registroSchema = Schema({

    idRegistro: {
        type: String,
        required: [true, 'El id del registro es requerido']
    },

    formato: {
        type: String,
        required: [true, 'El tipo de formato es requerido']
    },

    datos: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }

});

//modificar metodo json respuesta
registroSchema.methods.toJSON = function(){
    const { __v, _id, ...registro} = this.toObject();
    return registro;
}

module.exports = model('Registro', registroSchema);