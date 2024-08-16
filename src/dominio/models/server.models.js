const express = require('express');
const cors = require('cors');

const { dbConecction } = require('../../config/db/mongoDB.db'); 
const { crearUserAdmin } = require('../../config/admin/userAdmin.js');
const { limitPayloadSize } = require('../../infraestructura/middlewares/security.middleware.js');

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
        this.app.use(limitPayloadSize);
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