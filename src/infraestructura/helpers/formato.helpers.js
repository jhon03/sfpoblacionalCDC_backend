

const validarFormato = (formato) => {

    for (let [key, value] of Object.entries(formato)) {   
        if(key.includes(' ')){
            throw new Error(`El campo ${key} no puede tener espacios`);
        };
        if(value !== 'string' && value !== 'number'){
            throw new Error(`Tipo de dato invalido, el campo ${key} debe ser de tipo string o number`);
        }
    }
};

const convertirClavesAMayusculas = (obj) => {
    const nuevoObjeto = {};
    for (let [key, value] of Object.entries(obj)) {
        nuevoObjeto[key.toUpperCase()] = value;
    }
    return nuevoObjeto;
};

module.exports = {
    convertirClavesAMayusculas,
    validarFormato,
}