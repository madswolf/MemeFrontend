import {Entity, PrimaryGeneratedColumn, Column, ChildEntity} from "typeorm";
import { Votable } from "./Votable";

@ChildEntity()
export class MemeToptext extends Votable{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    memetext: string;

}
