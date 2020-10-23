import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn} from "typeorm";
import {User} from "./user.entity";

@Entity({name: "user_profiles"})
export class UserProfile {
    @PrimaryColumn({type: "uuid"})
    userId: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @OneToOne(_ => User)
    @JoinColumn({name: 'userId'})
    user: User;

    static create(user: User, firstName: string, lastName: string): UserProfile {
        const userProfile = new UserProfile();
        userProfile.user = user;
        userProfile.firstName = firstName;
        userProfile.lastName = lastName;
        return userProfile;
    }
}
