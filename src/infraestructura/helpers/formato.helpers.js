
const validarclaves = (objetoOriginal, objetoPeticion) => {
    for(let c in objetoPeticion){
        c = c.toUpperCase();
        if(!objetoOriginal[c]){
            throw new Error(`El campo ${c} no esta permitido`);
        }
    };
}

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
        if(typeof value === 'string') value = value.toUpperCase();
        nuevoObjeto[key.toUpperCase()] = value;
    }
    return nuevoObjeto;
};

const convertirValuesToUpperCase = (obj) => {
    const nuevoObjeto = {};
    for (let [key, value] of Object.entries(obj)) {
        if(typeof value === 'string' || value instanceof String){
            nuevoObjeto[key] = value.toUpperCase();
        } else {
            nuevoObjeto[key] = value;
        }
    }
    return nuevoObjeto;
}

const compararDatosPersonaWithFormato = (formato, datos = {}) => {
    try {
        for (let [key, tipo] of Object.entries(formato)) {
            if (!(key in datos)) {
                throw new Error(`El campo ${key} es requerido`);
            }
            if (typeof datos[key] !== tipo) {
                throw new Error(`El campo ${key} debe ser de tipo ${tipo}`);
            }
        }
    
        // Verificar que no hay campos adicionales no permitidos
        for (let key in datos) {
            if (!(key in formato)) {
                throw new Error(`El campo ${key} no está permitido`);
            }
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

//Helper para validar dos objetos y su similitud
const objetosIguales = (objetoOriginal, objetoPeticion) => {
    try {
        for(let [key, value] of Object.entries(objetoOriginal)){
            if(value !== objetoPeticion[key]){
                //console.log( `La clave ${key} tiene un valor diferente` );
                return false;
            }
        };
        return true;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    convertirClavesAMayusculas,
    convertirValuesToUpperCase,
    compararDatosPersonaWithFormato,
    objetosIguales,
    validarFormato,
    validarclaves
}