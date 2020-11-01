import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import { MemeBottomtext } from "../entity/MemeBottomText";
import { getFromTableRandom } from "./MemeControllerHelperMethods";

export class MemeBotttomtextController {

    private memeBottomtextRepository = getRepository(MemeBottomtext);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.memeBottomtextRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return this.memeBottomtextRepository.findOne(request.params.id);
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.memeBottomtextRepository.save(request.body);
    }

    async remove(request: Request, response: Response, next: NextFunction) {

        if (request.body.SECRET !== process.env.SECRET){
            response.status(403);
            return {you:"suck"};
        }

        let bottomtextToRemove = await this.memeBottomtextRepository.findOne(request.params.id);
        return await this.memeBottomtextRepository.remove(bottomtextToRemove);

    }

    async random(request: Request, response: Response, next: NextFunction) {
        let allMemeBottomtexts = await this.memeBottomtextRepository.find({relations:["votes"]});
        let bottomtext = getFromTableRandom(allMemeBottomtexts) as MemeBottomtext;
        return {id:bottomtext.id,votes:bottomtext.votes,data:bottomtext.memetext};
    }
}