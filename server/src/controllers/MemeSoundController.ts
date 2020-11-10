import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import { MemeSound } from "../entity/MemeSound";
import { getFromTableRandom } from "./MemeControllerHelperMethods";
import * as url from 'url';
import {soundsFolder, mediaHost} from '../index'

export class MemeSoundController {

    private memeSoundRepository = getRepository(MemeSound);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.memeSoundRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return this.memeSoundRepository.findOne(request.params.id);
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.memeSoundRepository.save(request.body);
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        if (request.body.SECRET !== process.env.SECRET){
            response.status(403);
            return {you:"suck"};
        }
        
        const soundToRemove = await this.memeSoundRepository.findOne(request.params.id);
        return await this.memeSoundRepository.remove(soundToRemove);
    }

    async random(request: Request, response: Response, next: NextFunction) {
        const allMemeSounds = await this.memeSoundRepository.find({relations:["votes"]});
        const memeSound =  getFromTableRandom(allMemeSounds) as MemeSound

        const memeURL = url.format({
            protocol: "https",
            host: mediaHost,
            pathname: ( `${soundsFolder}/${memeSound.filename}`)
        });

        return {
            id: memeSound.id,
            votes: memeSound.votes.reduce(function(acc,item){return (acc + (item.upvote ? 1 : -1))},0),
            data: memeURL
        };
    }

}