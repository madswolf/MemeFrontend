import { ChildEntity, ManyToOne} from "typeorm";
import { MemeBottomtext } from "./MemeBottomText";
import { MemeSound } from "./MemeSound";
import { MemeToptext } from "./MemeToptext";
import { MemeVisual } from "./MemeVisual";
import { Votable } from "./Votable";

@ChildEntity()
export class Meme extends Votable{
    
    @ManyToOne(() => MemeVisual, MemeVisual => MemeVisual.memes)
    visual: MemeVisual;

    @ManyToOne(() => MemeSound, MemeSound => MemeSound.memes)
    sound?: MemeSound;

    @ManyToOne(() => MemeToptext, MemeToptext => MemeToptext.memes)
    topText?: MemeToptext;

    @ManyToOne(() => MemeBottomtext, MemeBottomtext => MemeBottomtext.memes)
    bottomText?: MemeBottomtext;

}
