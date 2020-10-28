import { OneToOne, JoinColumn, ChildEntity} from "typeorm";
import { MemeBottomtext } from "./MemeBottomText";
import { MemeSound } from "./MemeSound";
import { MemeToptext } from "./MemeToptext";
import { MemeVisual } from "./MemeVisual";
import { Votable } from "./Votable";

@ChildEntity()
export class Meme extends Votable{
    @OneToOne(type => MemeVisual)
    @OneToOne(type => MemeSound)
    @OneToOne(type => MemeToptext)
    @OneToOne(type => MemeBottomtext)

    @JoinColumn()
    visual: MemeVisual;

    @JoinColumn()
    sound?: MemeSound;

    @JoinColumn()
    topText?: MemeToptext;

    @JoinColumn()
    bottomText?: MemeBottomtext;

}
