"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const logger = require("morgan");
class App {
    constructor() {
        this.express = express();
        this.express.use(express.static('public'));
        logger('tiny');
        this.express.use(logger('dev'));
        this.mountRoutes();
    }
    mountRoutes() {
        const router = express.Router();
        router.get('/', (req, res) => {
            res.json({
                message: 'Hello World!'
            });
        });
        router.get('/deathRolling', (req, res) => {
            res.send();
        });
        this.express.use('/', router);
    }
}
exports.default = new App().express;
//# sourceMappingURL=App.js.map