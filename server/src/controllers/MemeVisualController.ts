import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import { MemeVisual } from "../entity/MemeVisual";
import { getFromTableRandom } from "./MemeControllerHelperMethods";
import * as url from "url";
import {mediaHost, uploadfolder, visualsFolder} from '../index'

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
        if (request.body.SECRET !== process.env.SECRET){
            response.status(403);
            return {you:"suck"};
        }

        let visualToRemove = await this.memeVisualRepository.findOne(request.params.id);
        return await this.memeVisualRepository.remove(visualToRemove);
    }

    async random(request: Request, response: Response, next: NextFunction) {
        let allMemeVisuals = await this.memeVisualRepository.find({relations:["votes"]});
        let memeVisual =  getFromTableRandom(allMemeVisuals) as MemeVisual
        let memeURL = url.format({
            protocol:request.protocol,
            host:mediaHost,
            pathname: ( `${visualsFolder}/${memeVisual.filename}`)
        });
        return {id:memeVisual.id,votes:memeVisual.votes.length,data:memeURL};
    }
}