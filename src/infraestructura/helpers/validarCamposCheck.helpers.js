const { check } = require('express-validator');
const { noEstaVacio, esObjeto, todosCamposSonString } = require('../validacionesPersonalizadas/programa.validacionesPersonalizadas');
const { contrasenaEsValida } = require('./user.helpers');

exports.checkCamposColaborador = [
    check('tipoIdentificacion', 'El tipo de identificacion es requerida').not().isEmpty(),
    check('tipoIdentificacion', 'El tipo de identificacion debe ser un string').isString(),
    check('numeroIdentificacion', 'El numero de identificacion es requerido').not().isEmpty(),
    check('numeroIdentificacion','El numero de identificacion debe ser numerica').isNumeric(),
    check('nombreColaborador', 'El nombre del colaborador es requerido').not().isEmpty(),
    check('nombreColaborador', 'El nombre del colaborador debe ser un string').isString(),
];

exports.checkCamposTipoIdentificacion = [
    check('nombreIdentificacion', 'El nombre del tipo de identificacion es requerido').not().isEmpty(),
    check('nombreIdentificacion', 'El nombre del tipo de identificacion debe ser de tipo string').isString(),
];

exports.checkCamposPrograma = [
    check("nombrePrograma", "El nombre del programa es requerido").not().isEmpty(),
    check("nombrePrograma", "El nombre del programa debe ser de tipo string").isString(),
    check("formato", "El formato del programa es requerido").not().isEmpty(),
    check("formato", "El formato del programa no puede estar vacio").custom(noEstaVacio),
    check("formato", "El formato del programa debe ser de tipo objeto").custom(esObjeto),
    check("formato.*", "los campos del formato deben ser de tipo string").custom(todosCamposSonString)
]

exports.checkCamposRol = [
    check('nombreRol', 'El nombre del rol es requerido').not().isEmpty(),
    check('nombreRol', 'El nombre del rol debe ser de tipo string').isString(),
    check('descripcion', 'La descripcion del rol es requerida').not().isEmpty(),
    check('descripcion', 'La descripcion debe ser de tipo string').isString(),
]

exports.checkCamposUser = [
    check('nombreUsuario', 'El nombre de usuario es requerido').not().isEmpty(),
    check('nombreUsuario', 'El nombre de usuario debe ser de tipo string').isString(),
    check('contrasena', 'La contrasena es requerida').not().isEmpty(),
    check('contrasena', 'la contrasena debe ser de tipo string').isString(),
]