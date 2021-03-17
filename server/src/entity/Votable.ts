import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, TableInheritance } from "typeorm";
import { Topic } from "./Topic";
import { Vote } from "./Vote";

@Entity()
@TableInheritance({column: {type: 'varchar', name: 'type'}})
export abstract class Votable {

    @PrimaryGeneratedColumn()
    id: number;

    //subcultures or topics
    @ManyToOne(() => Topic)
    topic: Topic; 

    @OneToMany(() => Vote, vote => vote.element)
    votes: Vote[];
    
}