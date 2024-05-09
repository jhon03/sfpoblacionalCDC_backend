const { check } = require('express-validator');

exports.CheckCamposColaborador = [
    check('tipoIdentificacion', 'El tipo de identificacion es requerida').not().isEmpty(),
    check('tipoIdentificacion', 'El tipo de identificacion debe ser un string').isString(),
    check('numeroIdentificacion', 'El numero de identificacion es requerido').not().isEmpty(),
    check('numeroIdentificacion','El numero de identificacion debe ser numerica').isNumeric(),
    check('nombreColaborador', 'El nombre del colaborador es requerido').not().isEmpty(),
    check('nombreColaborador', 'El nombre del colaborador debe ser un string').isString(),
    check('edadColaborador', 'La edad del colaborador es requerida').not().isEmpty(),
    check('edadColaborador', 'La edad del colaborador debe ser numerica').isNumeric(),
]