import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class MemeBottomtext {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    memetext: string;

}
