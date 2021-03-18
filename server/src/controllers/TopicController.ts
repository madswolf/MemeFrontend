import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import {Topic} from "../entity/Topic"
import { MemeToptext } from "../entity/MemeToptext";
import { MemeBottomtext } from "../entity/MemeBottomText";
import { MemeVisual } from "../entity/MemeVisual";
import { MemeSound } from "../entity/MemeSound";
import UserController from "./UserController";
import { Meme } from "../entity/Meme";
import { User } from "../entity/User";
import { signToken, verifyUser } from "./MemeControllerHelperMethods";


export class TopicController {
  
    static async all (req: Request, res: Response){
        const TopicRepository = getRepository(Topic);
        const votes = await TopicRepository.find();
        res.send(votes);
    };
  
    static async one(request: Request, response: Response) {
        let TopicRepository = getRepository(Topic);
        const topic = await TopicRepository.findOne(request.params.id);

        return {
            id: topic.id,
            name:topic.name,
            owner: topic.owner,
            moderators: topic.moderators
        };
    }
  
    static async remove (req: Request, res: Response){

        const TopicRepository = getRepository(Topic);
        const user = await verifyUser(res);

        if(!user){
          return;
        }

        let topic;

        try {
            topic = await TopicRepository.findOneOrFail({where: {name: req.params.topic},relations:["Owner"]});
        } catch (error) {
            res.status(404).send({error: "Topic not found"});
            return;
        }

        if(topic.owner !== user){
            res.status(401).send({error: "User not is not owner"});
            return;
        }

        await TopicRepository.remove(topic);
        const newToken = signToken(user);

        return res.status(204).send({token: newToken});
    }

    static async save(req: Request, res: Response){

        const TopicRepository = getRepository(Topic);
        
        let user = await verifyUser(res);

        if(!user){
          return;
        }

        
        
        let topic = new Topic()
        topic.name = req.params.topic
        topic.owner = user
        
        try{
            await TopicRepository.save(topic);
        } catch(e) {
            console.log("error" + e)
            res.status(400).send({error: e});
            return;
        }
        
        const newToken = signToken(user);
        res.status(201).send({token: newToken});
        return;
    };

    static async update(req: Request, res: Response){

        const TopicRepository = getRepository(Topic);
        
        let user = await verifyUser(res);

        if(!user){
          return;
        }

        let topic;

        try {
            topic = await TopicRepository.findOneOrFail({where: {name: req.params.topic},relations:["owner","moderators"]});
        } catch (error) {
            res.status(404).send({error: "Topic not found"});
            return;
        }

        if(topic.owner !== user){
            res.status(401).send({error: "User not is not owner"});
            return;
        }
        let moderator
        try {
            moderator = getRepository(User).findOneOrFail({where: {name: req.params.username}})
        } catch (error) {
            res.status(404).send({error: "User for moderator not found"});
            return;
        }

        if(moderator.find(moderator)){
            res.status(404).send({error: "User is already a moderator"});
            return;
        }

        topic.moderators.push(moderator);
        TopicRepository.save(topic);
        
        const newToken = signToken(user);
        res.status(201).send({token: newToken});
        return;
    };

}