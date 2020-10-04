import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Meme} from "../entity/Meme";
import { getFromTableRandom } from "./MemeControllerHelperMethods";

export class MemeController {

    private memeRepository = getRepository(Meme);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.memeRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return this.memeRepository.findOne(request.params.id);
    }

    async save(request: Request, response: Response, next: NextFunction) {
       console.log(request);
        //return this.memeRepository.save(request.body);
        return ;
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let memeToRemove = await this.memeRepository.findOne(request.params.id);
        await this.memeRepository.remove(memeToRemove);
    }

    async random(request: Request, response: Response, next: NextFunction) {
        let allMemes = await this.memeRepository.find();
        return getFromTableRandom(allMemes) as Meme;
    }

}