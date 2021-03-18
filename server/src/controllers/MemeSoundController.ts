import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import { MemeSound } from "../entity/MemeSound";
import { getElement, getFromTableRandom, getTopic, isModerator, verifyUser } from "./MemeControllerHelperMethods";
import * as url from 'url';
import {soundsFolder, mediaHost, uploadfolder} from '../index'
import { Topic } from "../entity/Topic";

export class MemeSoundController {

    private memeSoundRepository = getRepository(MemeSound);

    async all(req: Request, res: Response, next: NextFunction) {
        return this.memeSoundRepository.find();
    }

    async one(req: Request, res: Response, next: NextFunction) {
        const memeVisual = await this.memeSoundRepository.findOne(req.params.id,{relations:["votes"]});

        const memeURL = url.format({
            protocol: "https",
            host: mediaHost,
            pathname: ( `${soundsFolder}/${memeVisual.filename}`)
        });

        return {
            id: memeVisual.id,
            votes: memeVisual.votes.reduce(function(acc,item){return (acc + (item.upvote ? 1 : -1))},0),
            data: memeURL
        };
    }

    async save(req: Request, res: Response, next: NextFunction) {
        let sound = new MemeSound();
        if(req.params.topic){
            
            let topic = await getTopic(req,res);
            if (!topic){
                return;
            }
            sound.topic = topic
        }

        req.files.soundFile.mv(uploadfolder + '/' + soundsFolder + '/' + req.files.soundFile.name)
        sound.filename = req.files.soundFile.name;

        return this.memeSoundRepository.save(sound);
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

            let soundToRemove = await getElement(MemeSound,req,res,"Toptext not found in topic",topic);
            if(!soundToRemove){
                return;
            }

            return this.memeSoundRepository.remove(soundToRemove)
        }

        if (req.body.SECRET !== process.env.SECRET){
            res.status(403);
            return {you:"suck"};
        }
        let soundToRemove = await getElement(MemeSound,req,res,"Toptext not found in topic");
        if(!soundToRemove){
            return;
        }

        return this.memeSoundRepository.remove(soundToRemove);
    }

    async random(req: Request, res: Response, next: NextFunction) {
        let allMemeSounds
        if(req.params.topic){
            const topic = await getRepository(Topic).find({where:{name:req.params.name}})
            allMemeSounds = await this.memeSoundRepository.find({where:{topic:topic},relations:["votes"]});
        }else {
            allMemeSounds = await this.memeSoundRepository.find({relations:["votes"]});
        }
        const sound = getFromTableRandom(allMemeSounds) as MemeSound;

        const memeURL = url.format({
            protocol: "https",
            host: mediaHost,
            pathname: ( `${soundsFolder}/${sound.filename}`)
        });

        return {
            id: sound.id,
            votes: sound.votes.reduce(function(acc,item){return (acc + (item.upvote ? 1 : -1))},0),
            data: memeURL
        };
    }

}