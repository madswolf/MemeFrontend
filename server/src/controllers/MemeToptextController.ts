import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import { MemeToptext } from "../entity/MemeToptext";
import { getFromTableRandom } from "./MemeControllerHelperMethods";
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
            
            let topic;

            try{
                topic = getRepository(Topic).findOneOrFail({where: {name: req.params.topic}})
            } catch (error){
                res.status(404).send({error: "Topic not found"});
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
        if (req.body.SECRET !== process.env.SECRET){
            res.status(403);
            return {you:"suck"};
        }

        const toptextToRemove = await this.memeToptextRepository.findOne(req.params.id);
        return await this.memeToptextRepository.remove(toptextToRemove);
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