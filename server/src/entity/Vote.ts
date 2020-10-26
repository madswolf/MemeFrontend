import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { User } from "./User";
import { Votable } from "./Votable";


@Entity()
export class Vote {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    upvote: boolean;

    @ManyToOne(() => User, user => user.votes)
    user: User;

    @ManyToOne(() => Votable, Votable => Votable.votes)
    element: Votable;

}
