import {getRepository,Not,Like, LessThan, Raw} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Meme} from "../entity/Meme";
import { getFromTableRandom, saveVerifyCompress } from "./MemeControllerHelperMethods";
import { MemeVisual } from "../entity/MemeVisual";
import { MemeSound } from "../entity/MemeSound";
import { MemeToptext } from "../entity/MemeToptext";
import { MemeBottomtext } from "../entity/MemeBottomText";
import {uploadfolder,visualsFolder,soundsFolder, fileSizeLimit, mediaHost} from '../index';
import { MemeSoundController } from "./MemeSoundController";
import * as url from 'url';


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
        
        const result = await saveVerifyCompress(request.files.visualFile,visualsFolder,response)
        if(result.error){
            return result;
        }

        const body = request.body as MemeTextBody 
        const memevisual = await this.memeVisualRepository.save({filename: result.filename})
        const meme = new Meme();

        meme.visual = memevisual;
        
        if (body.toptext !== ""){
            const memetoptext = await this.memeToptextRepository.save({memetext: body.toptext}) 
            meme.topText = memetoptext
        }

        if (body.bottomtext !== ""){
            const memebottomtext =  await this.memeBottomtextRepository.save({memetext: body.bottomtext}) 
            meme.bottomText = memebottomtext
        }

        if (request.files.soundFile){
            request.files.soundFile.mv(uploadfolder + '/' + soundsFolder + '/' + request.files.soundFile.name)
            const memesound = await this.memeSoundRepository.save({filename: request.files.soundFile.name})
            meme.sound = memesound
        }

        return this.memeRepository.save(meme);
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        if (request.body.SECRET !== process.env.SECRET){
            response.status(403);
            return {you:"suck"};
        }
        
        const memeToRemove = await this.memeRepository.findOne(request.params.id);
        return await this.memeRepository.remove(memeToRemove);
    }

    //This is a custom endpoint made for Hydrobot, so filters are applied
    async random(request: Request, response: Response, next: NextFunction) {
        const allMemes = await this.memeRepository.find();

        const visual = getFromTableRandom(await this.memeVisualRepository.find({filename: Not(Like("%.gif"))})) as MemeVisual
        const toptext = getFromTableRandom(await this.memeToptextRepository.find({memetext: Raw(alias =>  `char_length(${alias}) < 150`)})) as MemeToptext
        const bottomtext = getFromTableRandom(await this.memeBottomtextRepository.find({memetext: Raw(alias =>  `char_length(${alias}) < 150`)})) as MemeBottomtext

        const visualURL = url.format({
            protocol: "https",
            host: mediaHost,
            pathname: ( `${visualsFolder}/${visual.filename}`)
        });

        return {
            visual:visualURL,
            toptext:toptext.memetext,
            bottomtext:bottomtext.memetext
        }
    }
}