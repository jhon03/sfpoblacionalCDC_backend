const { Schema, model } = require('mongoose');

const personaSchema = Schema({
    
    idPersona: {
        type: String,
        required: [true, "El id de la persona es requerido"]
    }, 

    programa: {
        type: String,
        required: [true, 'El programa es requerido']
    },

    fechaRegistro: {
        type: String,
        required: [true, 'La fecha de registro de la persona es requerida']
    },

    estado: {
        type: String,
        default: "ACTIVO"
    },

    datos: {
        type: Schema.Types.Mixed,
        required: [true, "Los datos de la persona son requeridos"]
    }

});

personaSchema.methods.toJSON = function(){
    const { __v, _id, ...persona} = this.toObject();
    return persona;
}

module.exports = model('Persona', personaSchema);



