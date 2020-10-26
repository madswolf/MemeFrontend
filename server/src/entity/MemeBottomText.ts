import { PrimaryGeneratedColumn, Column, ChildEntity} from "typeorm";
import { Votable } from "./Votable";

@ChildEntity()
export class MemeBottomtext  extends Votable{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    memetext: string;

}
