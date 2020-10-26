import {Entity, PrimaryGeneratedColumn, Column, ChildEntity} from "typeorm";
import { Votable } from "./Votable";

@ChildEntity()
export class MemeSound extends Votable{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename: string;

}
