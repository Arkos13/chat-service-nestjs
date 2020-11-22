import {ConfirmEmailToken} from "../entities/confirm-email-token.entity";

export interface ConfirmEmailTokenRepositoryInterface {
    findOneByUserIdAndEmail(userId: string, email: string): Promise<ConfirmEmailToken | undefined>;
    findOneByToken(token: string): Promise<ConfirmEmailToken | undefined>;
    save(token: ConfirmEmailToken): Promise<void>;
    remove(token: ConfirmEmailToken): Promise<void>;
}