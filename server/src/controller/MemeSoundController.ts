import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import { MemeSound } from "../entity/MemeSound";
import { getFromTableRandom } from "./MemeControllerHelperMethods";

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
        let soundToRemove = await this.memeSoundRepository.findOne(request.params.id);
        await this.memeSoundRepository.remove(soundToRemove);
    }

    async random(request: Request, response: Response, next: NextFunction) {
        let allMemeSounds = await this.memeSoundRepository.find();
        return getFromTableRandom(allMemeSounds) as MemeSound;
    }

}