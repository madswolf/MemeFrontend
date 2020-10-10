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
        return this.memeToptextRepository.findOne(request.params.id);
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.memeToptextRepository.save(request.body);
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        if (request.body.SECRET !== process.env.SECRET){
            response.status(403);
            return {you:"suck"};
        }

        let toptextToRemove = await this.memeToptextRepository.findOne(request.params.id);
        return await this.memeToptextRepository.remove(toptextToRemove);
    }
    
    async random(request: Request, response: Response, next: NextFunction) {
        let allMemeToptexts = await this.memeToptextRepository.find();
        let toptext = getFromTableRandom(allMemeToptexts) as MemeToptext;
        return {data:toptext.memetext};
    }

}