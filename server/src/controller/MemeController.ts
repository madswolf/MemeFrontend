import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Meme} from "../entity/Meme";
import { getFromTableRandom, compressImage } from "./MemeControllerHelperMethods";
import { MemeVisual } from "../entity/MemeVisual";
import { MemeSound } from "../entity/MemeSound";
import { MemeToptext } from "../entity/MemeToptext";
import { MemeBottomtext } from "../entity/MemeBottomText";
import {uploadfolder,visualsFolder,soundsFolder, fileSizeLimit} from '../index';
import * as FileType from 'file-type';
import * as fs from "fs";
import * as MimeTypes from 'mime-types';

type MemeTextBody = {
    toptext:string,
    bottomtext:string
}

export class MemeController {

    private memeRepository = getRepository(Meme);
    private memeVisualRepository = getRepository(MemeVisual);
    private memeSoundRepository = getRepository(MemeSound);
    private memeToptextRepository = getRepository(MemeToptext);
    private memeBottomtextRepository = getRepository(MemeBottomtext);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.memeRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return this.memeRepository.findOne(request.params.id);
    }

    async save(request: Request , response: Response, next: NextFunction) {
        //check if any one component is too large
        if (request.files.visualFile.data.length > fileSizeLimit || (request.files.soundFile && request.files.soundFile.data.length > fileSizeLimit)){
            response.status(413);
            return {error:"Filesize too large"};
        }
        if(request.body.toptext.length > 512 || request.body.bottomtext.length > 512){
            response.status(413);
            return {error:"Top/Bottomtext too long"};
        }
        
        await request.files.visualFile.mv(`${uploadfolder}/${visualsFolder}/temp/` + request.files.visualFile.name);

        const type = await FileType.fromFile(`${uploadfolder}/${visualsFolder}/`+ '/temp/' + request.files.visualFile.name)

        //validation of file type
        if (type.mime.toString() !== request.files.visualFile.mimetype || MimeTypes.lookup(request.files.visualFile.name) !== type.mime.toString() ){
            fs.unlinkSync(`${uploadfolder}/${visualsFolder}/`+ '/temp/' + request.files.visualFile.name);
            response.status(415)
            //unsure if this is improper form for returning errors
            return {error:"Mismatch between file mimetype and file extension"};
        }

        var fileName = compressImage(`${uploadfolder}/${visualsFolder}/temp/`,`${uploadfolder}/${visualsFolder}/`,request.files.visualFile.name);
        
        const body = request.body as MemeTextBody 
        const memevisual = await this.memeVisualRepository.save({filename:fileName})
        var meme = {visual:memevisual};
        
        if (body.toptext !== ""){
            const memetoptext = await this.memeToptextRepository.save({memetext:body.toptext}) 
            meme['toptext'] = memetoptext
        }
        if (body.bottomtext !== ""){
            const memebottomtext =  await this.memeBottomtextRepository.save({memetext:body.bottomtext}) 
            meme['bottomtext'] = memebottomtext
        }
        if (request.files.soundFile){
            request.files.soundFile.mv(uploadfolder + '/' + soundsFolder + '/' + request.files.soundFile.name)
            const memesound = await this.memeSoundRepository.save({filename:request.files.soundFile.name})
            meme['sound'] = memesound
        }
        return this.memeRepository.save(meme);
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let memeToRemove = await this.memeRepository.findOne(request.params.id);
        await this.memeRepository.remove(memeToRemove);
    }

    async random(request: Request, response: Response, next: NextFunction) {
        const allMemes = await this.memeRepository.find()
        return getFromTableRandom(allMemes) as Meme;
    }

}