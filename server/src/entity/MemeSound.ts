import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class MemeSound {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename: string;

}
