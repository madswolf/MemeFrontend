import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import { MemeToptext } from "../entity/MemeToptext";
import { getElement, getFromTableRandom, getTopic, isModerator, verifyUser } from "./MemeControllerHelperMethods";
import { Topic } from "../entity/Topic";

export class MemeToptextController {

    private memeToptextRepository = getRepository(MemeToptext);

    async all(req: Request, res: Response, next: NextFunction) {
        return this.memeToptextRepository.find();
    }

    async one(req: Request, res: Response, next: NextFunction) {
        const memeVisual = await this.memeToptextRepository.findOne(req.params.id,{relations:["votes"]});

        return {
            id: memeVisual.id,
            votes: memeVisual.votes.reduce(function(acc,item){return (acc + (item.upvote ? 1 : -1))},0),
            data: memeVisual.memetext
        };
    }

    async save(req: Request, res: Response, next: NextFunction) {
        if(req.params.topic){
            let {memetext} = req.body

            if(!memetext){
                res.status(400).send("Bad request");
                return;
            }
            
            let topic = await getTopic(req,res);
            if (!topic){
                return;
            }

            let topText = new MemeToptext();
            topText.memetext = memetext;
            topText.topic = topic
            
            return this.memeToptextRepository.save(topText)
        }
        return this.memeToptextRepository.save(req.body);
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

            let toptextToRemove = await getElement(MemeToptext,req,res,"Toptext not found in topic",topic);
            if(!toptextToRemove){
                return;
            }

            return this.memeToptextRepository.remove(toptextToRemove)
        }

        if (req.body.SECRET !== process.env.SECRET){
            res.status(403);
            return {you:"suck"};
        }

        const toptextToRemove = await this.memeToptextRepository.findOne(req.params.id);
        return this.memeToptextRepository.remove(toptextToRemove);

    }
    
    async random(req: Request, res: Response, next: NextFunction) {
        let allMemeToptexts
        if(req.params.topic){
            const topic = await getRepository(Topic).find({where:{name:req.params.name}})
            allMemeToptexts = await this.memeToptextRepository.find({where:{topic:topic},relations:["votes"]});
        }else {
            allMemeToptexts = await this.memeToptextRepository.find({relations:["votes"]});
        }
        const toptext = getFromTableRandom(allMemeToptexts) as MemeToptext;
        
        return {
            id: toptext.id,
            votes: toptext.votes.reduce(function(acc,item){return (acc + (item.upvote ? 1 : -1))},0),
            data: toptext.memetext
        };
    }

}