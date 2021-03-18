import {getRepository,Not,Like, LessThan, Raw} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Meme} from "../entity/Meme";
import { getElement, getFromTableRandom, getTopic, isModerator, saveVerifyCompress, verifyUser } from "./MemeControllerHelperMethods";
import { MemeVisual } from "../entity/MemeVisual";
import { MemeSound } from "../entity/MemeSound";
import { MemeToptext } from "../entity/MemeToptext";
import { MemeBottomtext } from "../entity/MemeBottomText";
import {uploadfolder,visualsFolder,soundsFolder, fileSizeLimit, mediaHost} from '../index';
import { MemeSoundController } from "./MemeSoundController";
import * as url from 'url';
import { Topic } from "../entity/Topic";

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

        if (!req.files.visualFile){
            res.status(400).send("Bad request");
            return;
        }

        if (req.files.visualFile.data.length > fileSizeLimit || (req.files.soundFile && req.files.soundFile.data.length > fileSizeLimit)){
            res.status(413);
            return {error:"Filesize too large"};
        }

        if(req.body.toptext.length > 512 || req.body.bottomtext.length > 512){
            res.status(413);
            return {error:"Top/Bottomtext too long"};
        }
        let topic;
        if(req.params.topic){
            topic = await getTopic(req,res);
            if (!topic){
                return;
            }
        }

        const result = await saveVerifyCompress(req.files.visualFile,visualsFolder,res)
        if(result.error){
            return result;
        }

        const {toptext,bottomtext} = req.body

        let memevisual = new MemeVisual();
        memevisual.filename = result.filename
        if(topic){
            memevisual.topic = topic
        }
        
        memevisual = await this.memeVisualRepository.save(memevisual)
        let meme = new Meme();
        
        if(topic){
            meme.topic = topic
        }
        meme.visual = memevisual;
        
        let memetoptext = new MemeToptext();
        if (toptext !== ""){
            memetoptext.memetext = toptext
            if(topic){
                memetoptext.topic = topic
            }
            memetoptext = await this.memeToptextRepository.save(memetoptext) 
            meme.topText = memetoptext
        }

        let memebottomtext = new MemeBottomtext();
        if (bottomtext !== ""){
            memebottomtext.memetext = toptext
            if(topic){
                memebottomtext.topic = topic
            }
            memebottomtext = await this.memeBottomtextRepository.save(memebottomtext) 
            meme.bottomText = memebottomtext
        }

        let memesound = new MemeSound();
        if (req.files.soundFile){
            req.files.soundFile.mv(uploadfolder + '/' + soundsFolder + '/' + req.files.soundFile.name)
            memesound.filename = req.files.soundFile.name
            if(topic){
                memesound.topic = topic
            }
            memesound = await this.memeSoundRepository.save(memesound)
            meme.sound = memesound
        }

        return this.memeRepository.save(meme);
    }

    async remove(req: Request, res: Response, next: NextFunction) {
        let id = req.params.id

        if(!id){
            res.status(400).send("Bad request");
            return;
        }

        if(req.params.topic){

            let topic = await getTopic(req,res,['moderators','owner']);
            if (!topic){
                return;
            }
           
            let user = await verifyUser(res);
            if(!user){
                return;
            }

            if(!isModerator(topic,user) && user.role != 'ADMIN'){
                res.status(401).send({error: "User is not a moderator of this topic"});
                return;
            }

            let memeToRemove = await getElement(MemeToptext,req,res,"Meme not found in topic",topic);
            if(!memeToRemove){
                return;
            }

            return this.memeRepository.remove(memeToRemove)
        }

        if (req.body.SECRET !== process.env.SECRET){
            res.status(403);
            return {you:"suck"};
        }

        const memeToRemove = await this.memeRepository.findOne(req.params.id);
        return this.memeRepository.remove(memeToRemove);
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