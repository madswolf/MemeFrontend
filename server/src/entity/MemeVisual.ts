import { Column, ChildEntity} from "typeorm";
import { Votable } from "./Votable";

@ChildEntity()
export class MemeVisual extends Votable{

    @Column()
    filename: string;

}
