import {getRepository, Index} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Meme} from "../entity/Meme";
import { getFromTableRandom, saveAndCompress } from "./MemeControllerHelperMethods";
import { MemeVisual } from "../entity/MemeVisual";
import { MemeSound } from "../entity/MemeSound";
import { MemeToptext } from "../entity/MemeToptext";
import { MemeBottomtext } from "../entity/MemeBottomText";
import {uploadfolder,visualsFolder,soundsFolder} from '../index';

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

        saveAndCompress(`${uploadfolder}/${visualsFolder}/`,request.files.visualFile);
        
        const body = request.body as MemeTextBody 
        const memevisual = await this.memeVisualRepository.save({filename:request.files.visualFile.name})
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