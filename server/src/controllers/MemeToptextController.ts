import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import { MemeToptext } from "../entity/MemeToptext";
import { getFromTableRandom } from "./MemeControllerHelperMethods";

export class MemeToptextController {

    private memeToptextRepository = getRepository(MemeToptext);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.memeToptextRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const memeVisual = await this.memeToptextRepository.findOne(request.params.id,{relations:["votes"]});

        return {
            id: memeVisual.id,
            votes: memeVisual.votes.reduce(function(acc,item){return (acc + (item.upvote ? 1 : -1))},0),
            data: memeVisual.memetext
        };
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.memeToptextRepository.save(request.body);
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        if (request.body.SECRET !== process.env.SECRET){
            response.status(403);
            return {you:"suck"};
        }

        const toptextToRemove = await this.memeToptextRepository.findOne(request.params.id);
        return await this.memeToptextRepository.remove(toptextToRemove);
    }
    
    async random(request: Request, response: Response, next: NextFunction) {
        const allMemeToptexts = await this.memeToptextRepository.find({relations:["votes"]});
        const toptext = getFromTableRandom(allMemeToptexts) as MemeToptext;
        
        return {
            id: toptext.id,
            votes: toptext.votes.reduce(function(acc,item){return (acc + (item.upvote ? 1 : -1))},0),
            data: toptext.memetext
        };
    }

}