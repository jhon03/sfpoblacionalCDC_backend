const { Schema, model } = require('mongoose');

const tipoIdentificacionSchema = Schema({

    idIdentificacion: {
        type: String,
        required: [true, 'El id del tipo de identificacion es requerida']
    },

    nombreIdentificacion: {
        type: String,
        required: [true, 'El nombre del tipo de identificacion es requerida']
    },

    estado: {
        type: Boolean,
        default: true
    }
});

tipoIdentificacionSchema.methods.toJSON = function(){
    const { __v, _id, ...tipoIdentificacion} = this.toObject();
    return tipoIdentificacion;
}

module.exports = model('TipoIdentificacion', tipoIdentificacionSchema);