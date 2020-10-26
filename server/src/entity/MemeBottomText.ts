import { Column, ChildEntity} from "typeorm";
import { Votable } from "./Votable";

@ChildEntity()
export class MemeBottomtext  extends Votable{

    @Column()
    memetext: string;

}
