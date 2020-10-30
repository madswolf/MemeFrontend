import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { Vote } from "../entity/Vote";
import { MemeToptext } from "../entity/MemeToptext";
import { MemeBottomtext } from "../entity/MemeBottomText";
import { MemeVisual } from "../entity/MemeVisual";
import { MemeSound } from "../entity/MemeSound";
import UserController from "./UserController";
import { Meme } from "../entity/Meme";

export const memeTypeToType = {
    "bottomtext":MemeBottomtext,
    "toptext":MemeToptext,
    "visual":MemeVisual,
    "sound":MemeSound,
    "meme":Meme
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
    
    let {upvote, ids, type} = req.body;

    if(!(upvote && ids && type)){
        res.status(400).send("Bad request");
        return;
    }

    let elementRepository = getRepository(memeTypeToType[type]);
    let VoteRepository = getRepository(Vote);
    let vote = new Vote();
    let element;

    if(type === "meme"){
      let meme = new Meme();
      meme.visual = await getRepository(MemeVisual).findOne(parseInt(ids[0]));

      let query = 
        getRepository(Meme).createQueryBuilder()
        .select("meme")
        .from(Meme,"meme")
        .where("meme.visual = :visual",{visual:meme.visual.id});

      if(ids[1]){
        meme.topText = await getRepository(MemeToptext).findOne(parseInt(ids[1]));
        query.andWhere("meme.topText = :topText",{topText:meme.topText.id});
      }
      if(ids[2]){
        meme.bottomText = await getRepository(MemeBottomtext).findOne(parseInt(ids[2]));
        query.andWhere("meme.bottomText = :bottomText",{bottomText:meme.bottomText.id});
      }
      if(ids[3]){
        meme.sound = await getRepository(MemeSound).findOne(parseInt(ids[3]));
        query.andWhere("meme.sound = :sound",{sound:meme.sound.id});

      }

      let exists = await query.getOne();

      if(exists){
        ids[0] = exists.id;
      }else{
        ids[0] = (await getRepository(Meme).save(meme)).id;
      }
    }
    try {
        element = await elementRepository.findOneOrFail(ids[0]);
    } catch (error) {
        res.setHeader("error","Element not found");
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