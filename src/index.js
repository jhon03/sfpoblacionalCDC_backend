require('dotenv').config();

const Server = require('../src/dominio/models/server.models');

const server = new Server();

server.listen(); 