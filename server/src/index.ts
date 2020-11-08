import "reflect-metadata";
import {createConnection, getRepository} from "typeorm";
import * as express from "express";
import * as logger from 'morgan'
import * as bodyParser from "body-parser";
import * as fileUpload from 'express-fileupload';
import * as path from 'path';
import {Request, Response} from "express";
import {Routes} from "./routes/routes";
import UserRoutes from './routes/UserRoutes';
import VoteRoutes from './routes/VoteRoutes';
import * as http from 'http';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import { User } from "./entity/User";
import { randomStringOfLength } from "./controllers/MemeControllerHelperMethods";
import UserController from "./controllers/UserController";
import * as fs from 'fs';


export const uploadfolder = '/var/www/memeserver/public';
export const visualsFolder = 'visual';
export const soundsFolder = 'sound';
export const profilePicFolder = 'profilePictures';
export const fileSizeLimit = 5000000;

createConnection().then(async connection => {

    // create express app
    dotenv.config()
    const app = express()

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended:true}))
    app.use(cors())
    app.use(fileUpload({createParentPath:true}))
    app.use(express.static(__dirname, {dotfiles: 'allow'}))
    logger('tiny')
    app.use(logger('dev'))
    

    app.use('/public', express.static(`${uploadfolder}`))

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

    app.use('/user', UserRoutes);
    app.use('/vote',VoteRoutes)

    if(process.env.ADMIN_USERNAME){
        let user = new User();
        user.username = process.env.ADMIN_USERNAME;
        user.email = process.env.ADMIN_EMAIL;
        user.profilePicFileName = process.env.ADMIN_PROFILEPIC;
        user.salt = randomStringOfLength(25);
        user.passwordHash = UserController.hashPassword(process.env.ADMIN_PASSWORD,user.salt);

        
        user.role = "ADMIN";
        const userRepository = getRepository(User);
        try {
            await userRepository.save(user);
          } catch (e) {
            console.log(e);
            return;
        }
        console.log(user);

    }else {
        console.log("not")
    }

    console.log(__dirname)
    fs.writeFile('/var/www/memeserver/helloworld.txt', 'Hello World!', function (err) {
        if (err) return console.log(err);
        console.log('Hello World > helloworld.txt');
      });
    
    const httpServer = http.createServer(app);
    httpServer.listen(process.env.PORT);

    console.log(`Express server has started on port ${process.env.PORT}. Open http://localhost:${process.env.PORT}/users to see results`);

}).catch(error => console.log(error));
