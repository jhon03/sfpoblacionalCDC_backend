const { v4: uuid } = require('uuid');

const generarId = () => {
    try {
        const id = uuid();
        return id;
    } catch (error) {
        throw new Error('Error al crear el id');
    }
};

//implementacion anterior 
const validateCamposPermitidosHelperAnt = (camposIntroducidos, camposPermitidos = [])=> {

    Object.keys( camposIntroducidos ).forEach( ( campo ) => {
        if(!camposPermitidos.includes( campo )) {
            throw new Error(`El campo ${campo} no esta permitido`);
        };
    });
};

const validateCamposPermitidosHelper = (camposIntroducidos, camposPermitidos) => {
    const camposEnviados = Object.keys(camposIntroducidos);
    const camposNoPermitidos = camposEnviados.filter(
        (campo) => !camposPermitidos.includes(campo)
    );

    if (camposNoPermitidos.length > 0) {
        throw new Error(
            `Los siguientes campos no están permitidos: ${camposNoPermitidos.join(
                ", "
            )}`
        );
    }
};

module.exports = {
    generarId,
    validateCamposPermitidosHelper
}