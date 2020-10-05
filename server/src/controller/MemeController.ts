import {getRepository, Index} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Meme} from "../entity/Meme";
import { getFromTableRandom } from "./MemeControllerHelperMethods";
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

    async allVisuals(request: Request, response: Response, next: NextFunction) {
        return this.memeVisualRepository.find();
    }

    async allSounds(request: Request, response: Response, next: NextFunction) {
        return this.memeSoundRepository.find();
    }

    async allToptexts(request: Request, response: Response, next: NextFunction) {
        return this.memeToptextRepository.find();
    }
    async allBottomtexts(request: Request, response: Response, next: NextFunction) {
        return this.memeBottomtextRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return this.memeRepository.findOne(request.params.id);
    }

    async oneVisual(request: Request, response: Response, next: NextFunction) {
        return this.memeVisualRepository.findOne(request.params.id);
    }

    async oneSound(request: Request, response: Response, next: NextFunction) {
        return this.memeSoundRepository.findOne(request.params.id);
    }

    async oneToptext(request: Request, response: Response, next: NextFunction) {
        return this.memeToptextRepository.findOne(request.params.id);
    }

    async oneBottomtext(request: Request, response: Response, next: NextFunction) {
        return this.memeBottomtextRepository.findOne(request.params.id);
    }

    async save(request: Request , response: Response, next: NextFunction) {
        const thing = request.files.visualFile
        const other = request.files.soundFile
        console.log(thing)
        console.log(other)
        console.log(uploadfolder)
        request.files.visualFile.mv(uploadfolder + '/' + visualsFolder + '/' + request.files.visualFile.name)
        
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
            console.log("hoopy")
            request.files.soundFile.mv(uploadfolder + '/' + soundsFolder + '/' + request.files.soundFile.name)
            const memesound = await this.memeSoundRepository.save({filename:request.files.soundFile.name})
            meme['sound'] = memesound
        }
        return this.memeRepository.save(meme);
    }

    async saveVisual(request: Request, response: Response, next: NextFunction) {
        return this.memeVisualRepository.save(request.body);
    }

    async saveSound(request: Request, response: Response, next: NextFunction) {
        return this.memeSoundRepository.save(request.body);
    }

    async saveToptext(request: Request, response: Response, next: NextFunction) {
        return this.memeToptextRepository.save(request.body);
    }

    async saveBottomtext(request: Request, response: Response, next: NextFunction) {
        return this.memeBottomtextRepository.save(request.body);
    }

    //return this.memeRepository.save(request.body);
    async remove(request: Request, response: Response, next: NextFunction) {
        let memeToRemove = await this.memeRepository.findOne(request.params.id);
        await this.memeRepository.remove(memeToRemove);
    }

    async removeVisual(request: Request, response: Response, next: NextFunction) {
        let memeToRemove = await this.memeVisualRepository.findOne(request.params.id);
        await this.memeVisualRepository.remove(memeToRemove);
    }

    async removeSound(request: Request, response: Response, next: NextFunction) {
        let memeToRemove = await this.memeSoundRepository.findOne(request.params.id);
        await this.memeSoundRepository.remove(memeToRemove);
    }

    async removeToptext(request: Request, response: Response, next: NextFunction) {
        let memeToRemove = await this.memeToptextRepository.findOne(request.params.id);
        await this.memeToptextRepository.remove(memeToRemove);
    }

    async removeBottomtext(request: Request, response: Response, next: NextFunction) {
        let memeToRemove = await this.memeBottomtextRepository.findOne(request.params.id);
        await this.memeBottomtextRepository.remove(memeToRemove);
    }

    async random(request: Request, response: Response, next: NextFunction) {
        let allMemes = await this.memeRepository.find();
        return getFromTableRandom(allMemes) as Meme;
    }

}