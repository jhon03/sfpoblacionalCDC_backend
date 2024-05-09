const {model, Schema} = require('mongoose');

const colaboradorSchema = Schema({

    idColaborador: {
        type: String,
        required: [true, 'El id del colaborador es requerido']
    },

    tipoIdentificacion: {
        type: String,
        requried: [true, 'El tipo de identificacion es requerida'],
    },

    numeroIdentificacion: {
        type: Number,
        required: [true, 'El numero de identificacion del colaborador es requerida']
    },

    nombreColaborador: {
        type: String,
        required: [true, 'El nombre del colaborador es requerido'],
    },

    edadColaborador: {
        type: Number,
        required: [true, 'La edad del colaborador es requerida']
    },

    estado: {
        type: String,
        default: "ACTIVO"
    }

});

colaboradorSchema.methods.toJSON = function(){
    const { __v, _id, ...colaborador} = this.toObject();
    return colaborador;
}

module.exports = model('Colaborador', colaboradorSchema);