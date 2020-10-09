import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as logger from 'morgan'
import * as bodyParser from "body-parser";
import * as fileUpload from 'express-fileupload';
import * as path from 'path';
import {Request, Response} from "express";
import {Routes} from "./routes";
import * as http from 'http';
import * as cors from 'cors';
import * as https from 'https'; 
import * as fs from 'fs';

export const uploadfolder = 'public';
export const visualsFolder = 'visual';
export const soundsFolder = 'sound';
export const fileSizeLimit = 5000000;

createConnection().then(async connection => {

    // create express app
    const app = express()
    const port = 80
    const pathToCert = "/etc/letsencrypt/live/mads.monster/"
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

    // setup express app here
    // setup https
    const privateKey = fs.readFileSync(path.join(pathToCert,'privkey.pem'), 'utf8');
    const certificate = fs.readFileSync(path.join(pathToCert,'cert.pem'), 'utf8');
    const ca = fs.readFileSync(path.join(pathToCert,'chain.pem'), 'utf8');

    const credentials = {
	    key: privateKey,
	    cert: certificate,
	    ca: ca
    };

    const httpServer = http.createServer(app);
    const httpsServer = https.createServer(credentials, app);

    // start express server

    httpServer.listen(port);
    httpsServer.listen(443);

    console.log(`Express server has started on port ${port}. Open http://localhost:${port}/users to see results`);

}).catch(error => console.log(error));
