import { ChildEntity, ManyToOne} from "typeorm";
import { MemeBottomtext } from "./MemeBottomText";
import { MemeSound } from "./MemeSound";
import { MemeToptext } from "./MemeToptext";
import { MemeVisual } from "./MemeVisual";
import { Votable } from "./Votable";

@ChildEntity()
export class Meme extends Votable{
    
    @ManyToOne(() => MemeVisual, MemeVisual => MemeVisual.memes,{ onDelete: "SET NULL"})
    visual: MemeVisual;

    @ManyToOne(() => MemeSound, MemeSound => MemeSound.memes,{ onDelete: "SET NULL"})
    sound?: MemeSound;

    @ManyToOne(() => MemeToptext, MemeToptext => MemeToptext.memes,{ onDelete: "SET NULL"})
    topText?: MemeToptext;

    @ManyToOne(() => MemeBottomtext, MemeBottomtext => MemeBottomtext.memes,{ onDelete: "SET NULL"})
    bottomText?: MemeBottomtext;

}
