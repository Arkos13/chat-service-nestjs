import {ConfirmEmailToken} from "../../../../model/entities/confirm-email-token.entity";
import {User} from "../../../../model/entities/user.entity";

export interface ConfirmEmailTokenFactoryInterface {
    create(user: User, newEmail: string): Promise<ConfirmEmailToken>
}