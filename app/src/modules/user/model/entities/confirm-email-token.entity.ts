import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "./user.entity";
import * as moment from "moment";

@Entity({name: "user_confirm_email_tokens"})
export class ConfirmEmailToken {
    @PrimaryColumn({type: "uuid"})
    id: string;

    @Column()
    confirmationToken: string;

    @Column()
    email: string;

    @ManyToOne(_ => User)
    @JoinColumn({name: 'userId'})
    user: User;

    @Column()
    userId: string;

    @Column({type: 'timestamp'})
    expires: string;

    static create(id: string, user: User, email: string, confirmationToken: string, expires: string): ConfirmEmailToken {
        const token = new ConfirmEmailToken();
        token.id = id;
        token.user = user;
        token.email = email;
        token.confirmationToken = confirmationToken;
        token.expires = expires;
        return token;
    }

    public isValidExpiresToken(): boolean {
        return moment(this.expires) >= moment()
    }
}