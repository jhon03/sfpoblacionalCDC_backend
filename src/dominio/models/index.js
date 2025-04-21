const Colaborador        = require('./colaborador.models');
const Persona            = require('./persona.models');
const Programa           = require('./programa.models');
const Rol                = require('./rol.models');
const Server             = require('./server.models');
const user               = require('./user.models');
const TipoIdentificacion = require('./tipoIdentificacion.models');
const FormularioPrograma = require('./formularioPrograma.model');
const Asistencia = require('./asistencias.models');
module.exports = {
    Colaborador,
    Persona,
    Programa,
    Rol,
    Server,
    user,
    TipoIdentificacion,
    FormularioPrograma,
    Asistencia
}