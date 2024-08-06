
exports.esObjeto = (value) => typeof value === 'object' && value !== null;

exports.todosCamposSonString = (value) => {
    for (let key in value) {
        if( typeof value[key] !== "string"){
            return false;
        }
        return true;
    }
};


exports.noEstaVacio = (value) => Object.keys(value).length > 0;
