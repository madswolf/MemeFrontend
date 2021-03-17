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
import { Topic } from "../entity/Topic";


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

    async all(req: Request, res: Response, next: NextFunction) {
        return this.memeRepository.find();
    }

    async one(req: Request, res: Response, next: NextFunction) {
        return this.memeRepository.findOne(req.params.id);
    }

    async save(req: Request , res: Response, next: NextFunction) {
        //check if any one component is too large
        if (req.files.visualFile.data.length > fileSizeLimit || (req.files.soundFile && req.files.soundFile.data.length > fileSizeLimit)){
            res.status(413);
            return {error:"Filesize too large"};
        }

        if(req.body.toptext.length > 512 || req.body.bottomtext.length > 512){
            res.status(413);
            return {error:"Top/Bottomtext too long"};
        }

        let topic = await getRepository(Topic).findOne({where:{name:req.params.topic}});
        
        const result = await saveVerifyCompress(req.files.visualFile,visualsFolder,res)
        if(result.error){
            return result;
        }

        const body = req.body as MemeTextBody 
        const memevisual = await this.memeVisualRepository.save({filename: result.filename,topic:topic})
        let meme = new Meme();
        meme.topic = topic;

        meme.visual = memevisual;
        
        if (body.toptext !== ""){
            const memetoptext = await this.memeToptextRepository.save({memetext: body.toptext,topic:topic}) 
            meme.topText = memetoptext
        }

        if (body.bottomtext !== ""){
            const memebottomtext =  await this.memeBottomtextRepository.save({memetext: body.bottomtext,topic:topic}) 
            meme.bottomText = memebottomtext
        }

        if (req.files.soundFile){
            req.files.soundFile.mv(uploadfolder + '/' + soundsFolder + '/' + req.files.soundFile.name)
            const memesound = await this.memeSoundRepository.save({filename: req.files.soundFile.name,topic:topic})
            meme.sound = memesound
        }

        return this.memeRepository.save(meme);
    }

    async remove(req: Request, res: Response, next: NextFunction) {
        if (req.body.SECRET !== process.env.SECRET){
            res.status(403);
            return {you:"suck"};
        }
        
        const memeToRemove = await this.memeRepository.findOne(req.params.id);
        return await this.memeRepository.remove(memeToRemove);
    }

    //This is a custom endpoint made for Hydrobot, so filters are applied
    async random(req: Request, res: Response, next: NextFunction) {
        const topicName = req.params.topic ? req.params.topic : "swucraft"
        const topic = await getRepository(Topic).findOne({where:{name:topicName}})
        
        const visual = getFromTableRandom(await this.memeVisualRepository.find({filename: Not(Like("%.gif")),topic:topic})) as MemeVisual
        const toptext = getFromTableRandom(await this.memeToptextRepository.find({memetext: Raw(alias =>  `char_length(${alias}) < 150`),topic:topic})) as MemeToptext
        const bottomtext = getFromTableRandom(await this.memeBottomtextRepository.find({memetext: Raw(alias =>  `char_length(${alias}) < 150`),topic:topic})) as MemeBottomtext

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