const {model, Schema} = require('mongoose');

const tokenSchema = Schema({

    idToken: {
        type: String,
        required: [true, 'El id del token es requerido']
    },

    accessToken: {
        type: String,
        required: [true, 'El token de acceso es requerido']
    },

    refreshToken: {
        type: String,
        required: [true, 'El token de refresco es requerido']
    },

    expiresAt: {
        type: Number,
        required: [true, 'El tiempo de expiracion del token es requerido']
    }
});

tokenSchema.methods.toJSON = function(){
    const { __v, _id, ...token} = this.toObject();
    return token;
}

module.exports = model('Token', tokenSchema);