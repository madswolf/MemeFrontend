import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne, ManyToMany, Unique} from "typeorm";
import { User } from "./User";


@Entity()
@Unique(["name"])
export class Topic {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToOne(() => User)
    owner: User;

    @ManyToMany(() => User)
    moderators: User[];
}
