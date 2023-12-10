import { IsNotEmpty, Length } from "class-validator";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Unique,
    OneToMany
} from "typeorm";
import { Vote } from "./Vote";

@Entity()
@Unique(["username"])
@Unique(['email'])
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(4,24)
    username: string;

    @Column()
    @Length(1,100)
    profilePicFileName: string;

    @Column()
    @Length(1,100)
    email: string;

    @Column()
    @Length(7,100)
    passwordHash: string;

    @Column()
    @Length(25)
    salt: string;

    @Column()
    @IsNotEmpty()
    role: string;

    
    @Column()
    @CreateDateColumn()
    createdAt: Date;
    
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Vote, vote => vote.user)
    votes: Vote[];

}
