const { model, Schema } = require('mongoose');

const programaSchema = Schema({

    idPrograma: {
        type: String,
        required: [true, 'El id del programa es requerido']
    },

    colaborador: {
        type: String,
        required: [true, 'El colaborador es requerido']
    },

    estado: {
        type: String,
        default: "ACTIVO",
    },

    formato: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }

});

//modificar metodo json respuesta
programaSchema.methods.toJSON = function(){
    const { __v, _id, ...programa} = this.toObject();
    return programa;
}

module.exports = model('Programa', programaSchema);

