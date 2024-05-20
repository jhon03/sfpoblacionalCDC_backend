const express = require('express');
const cors = require('cors');

const { dbConecction } = require('../../config/db/mongoDB.db'); 

class Server { 

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            colaboradores: '/api/colaboradores',
            identificacion:'/api/identificaciones',
            programa:      '/api/programa',
            persona:       '/api/persona',
            registro:      '/api/registro',
        };

        this.middlewares();
        this.routes();

    };

    middlewares(){
        this.app.use( cors( { origin: process.env.ORIGIN_WEB, credentials: true} ));
        this.app.use( express.json() ); 
    };

    routes(){
        this.app.use(this.paths.colaboradores, require('../../infraestructura/routes/colaborador.routes') );
        this.app.use(this.paths.identificacion, require('../../infraestructura/routes/tipoIdentificacion.routes') );
        this.app.use(this.paths.programa, require('../../infraestructura/routes/programa.routes'));
        this.app.use(this.paths.persona, require('../../infraestructura/routes/persona.routes.js'))
    };

    async listen(){
        await dbConecction();
        this.app.listen(this.port, () => {
            console.log('servidor iniciado en el puerto ', this.port);
        })
    }
};


module.exports = Server;