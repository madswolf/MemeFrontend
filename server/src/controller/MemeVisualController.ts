import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import { MemeVisual } from "../entity/MemeVisual";
import { getFromTableRandom } from "./MemeControllerHelperMethods";

export class MemeVisualController {

    private memeVisualRepository = getRepository(MemeVisual);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.memeVisualRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return this.memeVisualRepository.findOne(request.params.id);
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.memeVisualRepository.save(request.body);
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let visualToRemove = await this.memeVisualRepository.findOne(request.params.id);
        await this.memeVisualRepository.remove(visualToRemove);
    }

    async random(request: Request, response: Response, next: NextFunction) {
        let allMemeVisuals = await this.memeVisualRepository.find();
        return getFromTableRandom(allMemeVisuals) as MemeVisual;
    }


}