import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import { MemeVisual } from "../entity/MemeVisual";
import { getElement, getFromTableRandom, getTopic, isModerator, saveVerifyCompress, verifyUser } from "./MemeControllerHelperMethods";
import * as url from "url";
import {mediaHost, uploadfolder, visualsFolder} from '../index'

import { Topic } from "../entity/Topic";

export class MemeVisualController {

    private memeVisualRepository = getRepository(MemeVisual);

    async all(req: Request, res: Response, next: NextFunction) {
        return this.memeVisualRepository.find();
    }

    async one(req: Request, res: Response, next: NextFunction) {
        const memeVisual = await this.memeVisualRepository.findOne(req.params.id,{relations:["votes"]});

        const memeURL = url.format({
            protocol: "https",
            host: mediaHost,
            pathname: ( `${visualsFolder}/${memeVisual.filename}`)
        });

        return {
            id: memeVisual.id,
            votes: memeVisual.votes.reduce(function(acc,item){return (acc + (item.upvote ? 1 : -1))},0),
            data: memeURL
        };
    }

    async save(req: Request, res: Response, next: NextFunction) {
        let visual = new MemeVisual();
        if(req.params.topic){
            
            let topic = await getTopic(req,res);
            if (!topic){
                return;
            }
            visual.topic = topic
        }

        req.files.visualFile.mv(uploadfolder + '/' + visualsFolder + '/' + req.files.visualFile.name)
        const result = await saveVerifyCompress(req.files.visualFile,visualsFolder,res)
        if(result.error){
            return result;
        }
        visual.filename = result.filename;
        return this.memeVisualRepository.save(visual);
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

            let visualToRemove = await getElement(MemeVisual,req,res,"Toptext not found in topic",topic);
            if(!visualToRemove){
                return;
            }

            return this.memeVisualRepository.remove(visualToRemove)
        }

        if (req.body.SECRET !== process.env.SECRET){
            res.status(403);
            return {you:"suck"};
        }

        let visualToRemove = await getElement(MemeVisual,req,res,"Toptext not found in topic");
        if(!visualToRemove){
            return;
        }

        return this.memeVisualRepository.remove(visualToRemove);

    }

    async random(req: Request, res: Response, next: NextFunction) {
        
        let allMemeVisuals
        if(req.params.topic){
            const topic = await getRepository(Topic).find({where:{name:req.params.name}})
            allMemeVisuals = await this.memeVisualRepository.find({where:{topic:topic},relations:["votes"]});
        }else {
            allMemeVisuals = await this.memeVisualRepository.find({relations:["votes"]});
        }
        const visual = getFromTableRandom(allMemeVisuals) as MemeVisual;

        const memeURL = url.format({
            protocol: "https",
            host: mediaHost,
            pathname: ( `${visualsFolder}/${visual.filename}`)
        });

        return {
            id: visual.id,
            votes: visual.votes.reduce(function(acc,item){return (acc + (item.upvote ? 1 : -1))},0),
            data: memeURL
        };
    }
}