import { Column, ChildEntity, OneToMany} from "typeorm";
import { Meme } from "./Meme";
import { Votable } from "./Votable";

@ChildEntity()
export class MemeSound extends Votable{

    @Column()
    filename: string;

    @OneToMany(() => Meme, Meme => Meme.sound)
    memes: Meme[];
}
