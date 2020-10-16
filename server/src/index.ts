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
import * as http from 'http';
import * as cors from 'cors';
import * as https from 'https'; 
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { User } from "./entity/User";
import { randomStringOfLength } from "./controllers/MemeControllerHelperMethods";
import UserController from "./controllers/UserController";


export const uploadfolder = 'public';
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
    app.use(express.static(path.join(__dirname,'build')))
    app.use(express.static(__dirname, {dotfiles: 'allow'}))
    logger('tiny')
    app.use(logger('dev'))
    
    app.get('/',function(req,res){
        res.sendFile(path.join(__dirname,'build','index.html'))
    })
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

    if(process.env.ADMIN_USERNAME){
        let user = new User();
        user.username = process.env.ADMIN_USERNAME;
        user.email = process.env.ADMIN_EMAIL;
        user.profilePicFileName = process.env.ADMIN_PROFILEPIC;
        user.salt = randomStringOfLength(25);
        user.password = UserController.hashPassword(process.env.ADMIN_PASSWORD,user.salt);

        
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
    
    if (process.env.PATH_TO_CERT){
        const privateKey = fs.readFileSync(path.join(process.env.PATH_TO_CERT,'privkey.pem'), 'utf8');
        const certificate = fs.readFileSync(path.join(process.env.PATH_TO_CERT,'cert.pem'), 'utf8');
        const ca = fs.readFileSync(path.join(process.env.PATH_TO_CERT,'chain.pem'), 'utf8');
    
        const credentials = {
            key: privateKey,
            cert: certificate,
            ca: ca
        };
        
        const httpsServer = https.createServer(credentials, app);
        httpsServer.listen(443);
    }
    
    const httpServer = http.createServer(app);
    httpServer.listen(process.env.PORT);

    console.log(`Express server has started on port ${process.env.PORT}. Open http://localhost:${process.env.PORT}/users to see results`);

}).catch(error => console.log(error));
