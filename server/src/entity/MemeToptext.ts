import { Column, ChildEntity} from "typeorm";
import { Votable } from "./Votable";

@ChildEntity()
export class MemeToptext extends Votable{

    @Column()
    memetext: string;

}
