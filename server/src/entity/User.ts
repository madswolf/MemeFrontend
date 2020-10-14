import { IsNotEmpty, Length } from "class-validator";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Unique
} from "typeorm";
import * as bcrypt from "bcryptjs";

@Entity()
@Unique(["username"])
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(4,24)
    username: string;

    @Column()
    @Length(7,100)
    password: string;

    @Column()
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

    hashPassword() {
        this.password = bcrypt.hashSync(this.password + this.salt, 8);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword + this.salt, this.password);
    }

}
