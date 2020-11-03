import {EntityManager, Repository} from "typeorm";
import {User} from "../../model/entities/user.entity";
import {UserRepositoryInterface} from "../../model/repositories/user.repository.interface";
import {Injectable} from "@nestjs/common";

@Injectable()
export class UserRepository implements UserRepositoryInterface {
    private repository: Repository<User>;

    constructor(
        private readonly em: EntityManager,
    ) {
        this.repository = em.getRepository<User>(User);
    }

    findOneByEmail(email: string): Promise<User | undefined> {
        return this.repository.findOne({ where: { email } });
    }

    async save(user: User): Promise<void> {
        await this.repository.save(user);
    }

    findOneByConfirmationToken(token: string): Promise<User | undefined> {
        return this.repository.findOne({ where: { confirmToken: token }});
    }

}