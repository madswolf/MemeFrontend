import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import { MemeBottomtext } from "../entity/MemeBottomText";
import { getElement, getFromTableRandom, getTopic, isModerator } from "./MemeControllerHelperMethods";
import { Topic } from "../entity/Topic";
import { checkRole } from "../middlewares/checkRole";
import {verifyUser} from "./MemeControllerHelperMethods"

export class MemeBotttomtextController {

    private memeBottomtextRepository = getRepository(MemeBottomtext);

    async all(req: Request, res: Response, next: NextFunction) {
        return this.memeBottomtextRepository.find();
    }

    async one(req: Request, res: Response, next: NextFunction) {
        const memeVisual = await this.memeBottomtextRepository.findOne(req.params.id,{relations:["votes"]});

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

            let bottomText = new MemeBottomtext();
            bottomText.memetext = memetext;
            bottomText.topic = topic

            return this.memeBottomtextRepository.save(bottomText)
        }

        return this.memeBottomtextRepository.save(req.body);
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

            let bottomtextToRemove = await getElement(MemeBottomtext,req,res,"Toptext not found in topic",topic);
            if(!bottomtextToRemove){
                return;
            }

            return this.memeBottomtextRepository.remove(bottomtextToRemove)
        }

        if (req.body.SECRET !== process.env.SECRET){
            res.status(403);
            return {you:"suck"};
        }

        const bottomtextToRemove = await this.memeBottomtextRepository.findOne(req.params.id);
        return this.memeBottomtextRepository.remove(bottomtextToRemove);

    }

    async random(req: Request, res: Response, next: NextFunction) {
        let allMemeBottomtexts
        if(req.params.topic){
            const topic = await getRepository(Topic).find({where:{name:req.params.name}})
            allMemeBottomtexts = await this.memeBottomtextRepository.find({where:{topic:topic},relations:["votes"]});
        }else {
            allMemeBottomtexts = await this.memeBottomtextRepository.find({relations:["votes"]});
        }
        const bottomtext = getFromTableRandom(allMemeBottomtexts) as MemeBottomtext;
        
        return {
            id: bottomtext.id,
            votes: bottomtext.votes.reduce(function(acc,item){return (acc + (item.upvote ? 1 : -1))},0),
            data: bottomtext.memetext
        };
    }
}