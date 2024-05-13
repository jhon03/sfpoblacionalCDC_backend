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

    nombrePrograma: {
        type: String,
        required: [true, "El nombre del formato que deseas crear es requerido"],
    },

    formato: {
        type: Schema.Types.Mixed,
        required: [true, "El formato del programa es requerido"],
    }

});

//modificar metodo json respuesta
programaSchema.methods.toJSON = function(){
    const { __v, _id, ...programa} = this.toObject();
    return programa;
}

module.exports = model('Programa', programaSchema);

