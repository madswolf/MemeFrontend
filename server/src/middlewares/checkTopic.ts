import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { Topic } from "../entity/Topic";

declare module 'express-serve-static-core' {
    interface Request {
      topic?: Topic
    }
}

export const checkTopic = (relations: Array<string>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try{
            req.topic = await getRepository(Topic).findOneOrFail({where: {name: req.params.topic},relations:relations})
        } catch (error){
            req.topic = undefined
        }
        next();
    }
};