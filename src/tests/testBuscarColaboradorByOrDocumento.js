const buscarColaboradorByIdOrDocumento = require('../infraestructura/helpers/colaborador.helpers');

const testBuscarColaboradorByOrDocumento = async () => {
    console.log("Directorio actual:", __dirname);
    try {
        const colaborador = await buscarColaboradorByIdOrDocumento("2acd2add-dce5-4621-a72c-c2b78ddbb938", "6754576");
        console.log(colaborador);  // Verifica la salida en la consola
        if (colaborador && colaborador.email) {
            console.log("El colaborador tiene un email:", colaborador.email);
        } else {
            console.log("No se encontró el email del colaborador");
        }
    } catch (error) {
        console.log(error.message);
    }
};

testBuscarColaboradorByOrDocumento();  // Llama al método de prueba