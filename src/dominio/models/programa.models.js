const { model, Schema } = require('mongoose');

const programaSchema = Schema({

    idPrograma: {
        type: String,
        required: [true, 'El id del programa es requerido']
    },

    colaboradorCreador: {
        type: String,
        required: [true, 'El colaborador es requerido']
    },

    estado: {
        type: String,
        default: "EN PROCESO CONFIRMACION",
    },

    nombrePrograma: {
        type: String,
        required: [true, "El nombre del formato que deseas crear es requerido"],
    },

    fechaCreacion: {
        type: String,
        required: [true, 'La fecha de creacion del programa es requerida']
    },

    colaboradorResponsable: {
        type: String,
        default: ""
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

