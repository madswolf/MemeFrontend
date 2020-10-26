import { Column, ChildEntity} from "typeorm";
import { Votable } from "./Votable";

@ChildEntity()
export class MemeSound extends Votable{

    @Column()
    filename: string;

}
