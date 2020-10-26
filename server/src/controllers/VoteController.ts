import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { Vote } from "../entity/Vote";
import { MemeToptext } from "../entity/MemeToptext";
import { MemeBottomtext } from "../entity/MemeBottomText";
import { MemeVisual } from "../entity/MemeVisual";
import { MemeSound } from "../entity/MemeSound";
import UserController from "./UserController";

export const memeTypeToType = {
    "bottomtext":MemeBottomtext,
    "toptext":MemeToptext,
    "visual":MemeVisual,
    "sound":MemeSound
};

class VoteController{
  
  static all = async (req: Request, res: Response) => {
    let VoteRepository = getRepository(Vote);
    const votes = await VoteRepository.find();
    res.send(votes);
  };
  
  static one = async (req: Request, res: Response) => {
    
    const id: number = parseInt(req.params.id);
    let VoteRepository = getRepository(User);
    
    try {
      const vote = await VoteRepository.findOneOrFail(id);
      res.status(200).send(vote);
    } catch (error) {
      res.status(404).send("User not found");
    }
  };
  
  static save = async (req: Request, res: Response) => {
    
    let {upvote, id, type} = req.body;

    if(!(upvote && id && type)){
        res.status(400).send("Bad request");
        return;
    }

    let elementRepository = getRepository(memeTypeToType[type]);
    let VoteRepository = getRepository(Vote);
    let vote = new Vote();
    let element;

    try {
        element = await elementRepository.findOneOrFail(id);
    } catch (error) {
        res.setHeader("error","Element not found")
        res.status(404).send();
        return;
    }

    vote.user = await UserController.verifyUser(res);

    if(!vote.user){
      return;
    }

    
    let existingVote = await VoteRepository.findOne({where: {user:vote.user, element:element}})
    
    if(existingVote){
        existingVote.upvote = upvote;
        VoteRepository.save(existingVote);
        res.status(201).send();
        return;
    }

    vote.upvote = upvote;
    vote.element = element;
    
    const newToken = UserController.signToken(vote.user);
      
    res.setHeader("token", newToken);   

    try{
        await VoteRepository.save(vote);
    } catch(e) {
        res.setHeader("error",e);
        res.status(400).send();
        return;
    }

    res.status(201).send();
    return;
  };
  
}
  export default VoteController;