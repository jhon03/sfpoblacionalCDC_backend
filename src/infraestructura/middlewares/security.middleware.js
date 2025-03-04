const {rateLimit} = require('express-rate-limit');
const {slowDown} = require('express-slow-down');

const limitPayloadSize = (req, res, next) => {
    const MAX_PAYLOAD_SIZE = 1024 * 1024; // 1MB
    if (req.headers['content-length'] && parseInt(req.headers['content-length']) > MAX_PAYLOAD_SIZE) {
        return res.status(413).json({ error: 'Payload size exceeds the limit' });
    }
    next();
};

const limitPeticionIp = (canMinutos=1, canPeticiones=100) => {
 
    const minutos = Number(canMinutos);
    const peticiones = Number(canPeticiones);
    if(isNaN(minutos) || isNaN(peticiones)){ 
        return errorMidleware('El tiempo y la cantidad de peticiones deben ser números');
    }  
    const limit = rateLimit({
        max: peticiones,
        windowMs: minutos * 60 * 1000,
        handler: (req, res ) => {
            res.status(429).json({
                error: `Demasiadas peticiones desde esta IP. Por favor, inténtelo nuevamente en ${canMinutos} minutos.`,
            });
        }
    });
    return limit; 
};

const limitSpeedPeticion = (minutesEvaluated=15, limitAfterCantPeticion=5, secondsDelay=1) => {
    const minutos = Number(minutesEvaluated);
    const peticiones = Number(limitAfterCantPeticion);
    const segundosRetraso = Number(secondsDelay)
    if(isNaN(minutos) || isNaN(peticiones) || isNaN(segundosRetraso)){ 
        return errorMidleware('El tiempo y la cantidad de peticiones deben ser números validar la variables de entorno');
    }   
    const speedLimiter = slowDown({
        windowMs: minutos * 60 * 1000,
        delayAfter: peticiones,
        delayMs: () => segundosRetraso*1000,
    });
    return speedLimiter;
};

const errorMidleware = (errorMesage='') => {
    return (req, res, next) => {
        res.status(400).json({ 
            error: errorMesage
        });

    }
}





module.exports = {
    limitPayloadSize,
    limitPeticionIp,
    limitSpeedPeticion
}