import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class MemeToptext {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    memetext: string;

}
