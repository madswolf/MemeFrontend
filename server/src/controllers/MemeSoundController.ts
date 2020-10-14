import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import { MemeSound } from "../entity/MemeSound";
import { getFromTableRandom } from "./MemeControllerHelperMethods";
import * as url from 'url';
import {uploadfolder, soundsFolder} from '../index'

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
        
        let soundToRemove = await this.memeSoundRepository.findOne(request.params.id);
        return await this.memeSoundRepository.remove(soundToRemove);
    }

    async random(request: Request, response: Response, next: NextFunction) {
        let allMemeSounds = await this.memeSoundRepository.find();
        let memeSound =  getFromTableRandom(allMemeSounds) as MemeSound
        let memeURL = url.format({
            protocol:request.protocol,
            host:request.get('host'),
            pathname: ( `${uploadfolder}/${soundsFolder}/${memeSound.filename}`)
        });
        console.log(memeURL)
        return {data:memeURL};
    }

}