import { Column, ChildEntity, OneToMany} from "typeorm";
import { Meme } from "./Meme";
import { Votable } from "./Votable";

@ChildEntity()
export class MemeToptext extends Votable{

    @Column()
    memetext: string;

    @OneToMany(() => Meme, Meme => Meme.topText)
    memes: Meme[];
}
