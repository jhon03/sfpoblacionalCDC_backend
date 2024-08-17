const express = require('express');
const cors = require('cors');
const { xss } = require('express-xss-sanitizer');
const mongoSanitaze = require("express-mongo-sanitize");


const { dbConecction } = require('../../config/db/mongoDB.db'); 
const { crearUserAdmin } = require('../../config/admin/userAdmin.js');
const { limitPayloadSize, limitPeticionIp, limitSpeedPeticion } = require('../../infraestructura/middlewares/security.middleware.js');

class Server { 

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:          '/api/auth',
            colaboradores: '/api/colaboradores',
            identificacion:'/api/identificaciones',
            programa:      '/api/programa',
            persona:       '/api/persona',
            rol:           '/api/rol',
            user:          '/api/user',
        };

        this.middlewares();
        this.routes();

    };


    middlewares(){
        this.app.use( cors( { origin: process.env.ORIGIN_WEB, credentials: true} ));
        this.app.use( express.json() ); 
        this.app.use(limitPayloadSize);         //limitamos la cantidad de datos de la peticion
        this.app.use(mongoSanitaze()) //evitar inyeccion no sql 
        this.app.use(xss());  //sanitizacion datos evitar site scripting xss
        this.app.use(   //limita la cantidad de peticiones * x minutos
            limitPeticionIp( process.env.CANT_MINUTOS_PETICION, process.env.LIMITE_PETICIONES_IP)
        );        
        this.app.use(      //limita la velocidad de las peticiones x en una ventana de x minutos
            limitSpeedPeticion(process.env.CANT_MINUTES_EVALUATED, process.env.LIMIT_AFTER_CAN_PETICION, process.env.SECONDS_DELAY)
        ); 
    };

    routes(){
        this.app.use(this.paths.colaboradores, require('../../infraestructura/routes/colaborador.routes') );
        this.app.use(this.paths.identificacion, require('../../infraestructura/routes/tipoIdentificacion.routes') );
        this.app.use(this.paths.programa, require('../../infraestructura/routes/programa.routes'));
        this.app.use(this.paths.persona, require('../../infraestructura/routes/persona.routes.js'));
        this.app.use(this.paths.rol, require('../../infraestructura/routes/rol.routes.js'));
        this.app.use(this.paths.user, require('../../infraestructura/routes/user.routes.js'));
        this.app.use(this.paths.auth, require('../../infraestructura/routes/auth.routes.js'));
    };

    async listen(){
        await dbConecction();
        await crearUserAdmin();
        this.app.listen(this.port, () => {
            console.log('servidor iniciado en el puerto ', this.port);
        })
    }
};


module.exports = Server;