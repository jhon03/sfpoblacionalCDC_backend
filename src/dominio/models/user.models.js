const { model, Schema } = require('mongoose');

const userSchema = Schema({

    idUsuario:{
        type: String,
        required: [true, 'El id del usuario es requerido']
    },

    colaborador: {
        type: String,
        required: [true, 'El colaborador es requerido']
    },

    nombreUsuario: {
        type: String,
        required: [true, 'El nombre de usuario es requerido']
    },

    contrasena: {
        type: String,
        required: [true, 'La contraseña es requerida']
    },

    rol: {
        type: String,
        required: [true, 'El rol del usuario es requerido']
    },

    estado: {
        type: String,
        default: "ACTIVO"
    }

});

userSchema.methods.toJSON = function(){
    const { __v, _id, ...user} = this.toObject();
    return user;
}

module.exports = model('User', userSchema);