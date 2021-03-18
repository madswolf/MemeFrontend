import { UploadedFile } from "express-fileupload";
import * as compress_images from 'compress-images';
import * as fs from 'fs';
import {uploadfolder} from '../index';
import * as FileType from 'file-type';
import * as MimeTypes from 'mime-types';
import { Request, Response } from "express";
import { User } from "../entity/User";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { Topic } from "../entity/Topic";


export function getFromTableRandom(table: Object[]) {
    return table[Math.floor(Math.random() * table.length)];
}

export function randomStringOfLength(length: number) {

    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
 }

export function compressImage(srcPath: string, outPath: string, fileName: string){

    if(fs.existsSync(outPath + fileName)){
        const id = randomStringOfLength(5);
        fs.renameSync(srcPath + fileName, srcPath + id + fileName);
        fileName = id + fileName;
    }

    //optimize     
    compress_images(srcPath + fileName,outPath, { compress_force: false, statistic: true, autoupdate: true }, false,
        { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
        { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
        { svg: { engine: "svgo", command: "--multipass" } },
        { gif: { engine: "giflossy", command: ['--lossy=80'] } },
        function (error, completed, statistic) {
            //delete temp file and log result
            fs.unlinkSync(srcPath + fileName);
            console.log("-------------");
            console.log(error);
            console.log(completed);
            console.log(statistic);
            console.log("-------------");
        }
        
    );
    
    return fileName;
}

export async function saveVerifyCompress(file: UploadedFile, folder: string, res: Response){
    let fileName;

    if (file.name.length > 100){
        fileName = file.name.substring(0,95);
    }
    
    await file.mv(`${uploadfolder}/${folder}/temp/` + file.name);

    const type = await FileType.fromFile(`${uploadfolder}/${folder}/`+ '/temp/' + file.name)

    //validation of file type
    if (type.mime.toString() !== file.mimetype || MimeTypes.lookup(file.name) !== type.mime.toString() ){
        fs.unlinkSync(`${uploadfolder}/${folder}/`+ '/temp/' + file.name);
        res.status(415)
        //unsure if this is improper form for returning errors
        return {error:"Mismatch between file mimetype and file extension"};
    }

    fileName = compressImage(`${uploadfolder}/${folder}/temp/`, `${uploadfolder}/${folder}/`, file.name);
    
    return {filename:fileName};
}

export async function verifyUser(res: Response){
    const id = res.locals.jwtPayload.userId;

    let user: User;
    const UserRepository = getRepository(User);

    try {
      user = await UserRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
      return;
    }

    return user;
}

export async function signToken(user: User){
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWTSECRET,
      { expiresIn: "1h" }
      );
    return token;
  }

export function isModerator(topic:Topic,user:User){
    return topic.moderators.indexOf(user) > -1 || topic.owner == user
}

export async function getTopic(req:Request,res:Response,relations:string[] = []){
    let topic;
    try{
        topic = await getRepository(Topic).findOneOrFail({where: {name: req.params.topic},relations:relations})
    } catch (error){
        res.status(404).send({error: "Topic not found"});
        return;
    }
    return topic;
}

export async function getElement(type,req:Request,res:Response,error:string,topic:Topic = undefined){
    let element;
    try{
        if(topic){
            element = await getRepository(type).findOneOrFail({where:{id:req.params.id,topic:topic}});
        } else {
            element = await this.memeSoundRepository.findOneOrFail({where:{id:req.params.id}});
        }
    } catch (err){
        res.status(404).send({error: error});
        return;
    }
    return element;
}