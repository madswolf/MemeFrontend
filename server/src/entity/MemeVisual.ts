import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class MemeVisual {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename: string;

}
