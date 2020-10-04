import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm";
import { MemeBottomtext } from "./MemeBottomText";
import { MemeSound } from "./MemeSound";
import { MemeToptext } from "./MemeToptext";
import { MemeVisual } from "./MemeVisual";

@Entity()
export class Meme {
    @OneToOne(type => MemeVisual)
    @OneToOne(type => MemeSound)
    @OneToOne(type => MemeToptext)
    @OneToOne(type => MemeBottomtext)
    

    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn()
    visual: MemeVisual;

    @JoinColumn()
    sound?: MemeSound;

    @JoinColumn()
    topText: MemeToptext;

    @JoinColumn()
    bottomText: MemeBottomtext;

}
