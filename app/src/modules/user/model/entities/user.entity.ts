import {Column, Entity, OneToOne, PrimaryColumn} from "typeorm";
import {UserProfile} from "./user-profile.entity";

@Entity({name: "users"})
export class User {
    @PrimaryColumn({type: "uuid"})
    id: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column({nullable: true})
    confirmToken?: string;

    @Column({nullable: true})
    jwtToken?: string;

    @OneToOne(_ => UserProfile, profile => profile.user)
    profile: UserProfile;

    static create(id: string, email: string): User {
        const user = new User();
        user.id = id;
        user.email = email;
        return user;
    }
}