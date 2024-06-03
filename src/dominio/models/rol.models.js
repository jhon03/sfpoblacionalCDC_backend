const { Schema, model } = require('mongoose');      

const roleSchema = Schema({

    idRol: {
        type: String,
        required: [true, 'El id del rol es requerido']
    },

    nombreRol: {   
        type: String,
        required: [true, 'El nombre del rol es requerido']
    },

    descripcion: {
        type: String,
        required: [true, 'la descripcion del rol es requerida']
    },

    estado: {
        type: Boolean,
        default: true
    }
});

roleSchema.methods.toJSON = function(){
    const { __v, _id, ...role } = this.toObject();
    return role;
};

module.exports = model('Role', roleSchema)