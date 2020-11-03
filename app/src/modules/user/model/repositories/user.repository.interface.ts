import {User} from "../entities/user.entity";

export interface UserRepositoryInterface {
    findOneByEmail(email: string): Promise<User | undefined>;
    findOneByConfirmationToken(token: string): Promise<User | undefined>;
    save(user: User): Promise<void>;
}