const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const indexRoutes = require('./routes/indexRoutes.js');

class Server {

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    config() {
        this.app.set('port', process.env.PORT || 4000);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json({ limit: "50mb" }));
        this.app.use(express.urlencoded({ extended: false }));
    }

    routes() {
        this.app.use('/', indexRoutes);
    }

    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Servidor en el puerto', this.app.get('port'));
        });
    }
}

const server = new Server();
server.start();
