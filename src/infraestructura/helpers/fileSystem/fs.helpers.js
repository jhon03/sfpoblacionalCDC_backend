const fs = require('fs');

const leerArchivo = (pathArchivo) => {
    try {
        return fs.readFileSync(pathArchivo);
    } catch (error) {
        throw error;
    }

};


module.exports = {
    leerArchivo
}