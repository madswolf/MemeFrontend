import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as logger from 'morgan'
import * as bodyParser from "body-parser";
import {Request, Response} from "express";
import {Routes} from "./routes";
import {User} from "./entity/User";


createConnection().then(async connection => {

    // create express app
    const app = express();
    const port = 80;
    app.use(bodyParser.json());
    app.use(express.static('public'))
    logger('tiny')
    app.use(logger('dev'))

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next);
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)

            } else if (result !== null && result !== undefined) {
                res.json(result)
            }
        });
    });

    // setup express app here
    // ...
    
    
    // start express server
    app.listen(80);

    // insert new users for test
    await connection.manager.save(connection.manager.create(User, {
        userName: "Gamer420",
        passwordHash: "ax987dacksad",
    }));
    await connection.manager.save(connection.manager.create(User, {
        userName: "xxPhantom69xx",
        passwordHash: "15m,4123axdwq",
    }));

    console.log(`Express server has started on port ${port}. Open http://localhost:${port}/users to see results`);

}).catch(error => console.log(error));
