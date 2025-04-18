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
        required: [true, "El nombre del programa que deseas crear es requerido"],
        unique: true,
    },

    informacion: {
        type: Schema.Types.Mixed,
        required: [true, "La informacion del programa es requerido"],
    },

    fechaCreacion: {
        type: String,
        required: [true, 'La fecha de creacion del programa es requerida']
    },

    colaboradorResponsable: {
        type: String,
        default: ""
    },

    // para formatos de onedrive
    formatosActividades: {
        fechaCreacion: String,
        archivos: [
            {
            name: String,
            webUrl: String,
            downloadUrl: String
            }
        ]
    },

    formato: {
        type: Schema.Types.Mixed,
        default: {
            "":""
        }
    }

});

//modificar metodo json respuesta
programaSchema.methods.toJSON = function(){
    const { __v, _id, ...programa} = this.toObject();
    return programa;
}

module.exports = model('Programa', programaSchema);

