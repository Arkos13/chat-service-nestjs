import {EntityManager, Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {ConfirmEmailTokenRepositoryInterface} from "../../model/repositories/confirm-email-token.repository.interface";
import {ConfirmEmailToken} from "../../model/entities/confirm-email-token.entity";

@Injectable()
export class ConfirmEmailTokenRepository implements ConfirmEmailTokenRepositoryInterface {

    private repository: Repository<ConfirmEmailToken>;

    constructor(
        private readonly em: EntityManager,
    ) {
        this.repository = em.getRepository<ConfirmEmailToken>(ConfirmEmailToken);
    }

    findOneByToken(token: string): Promise<ConfirmEmailToken | undefined> {
        return this.repository.findOne({where: {confirmationToken: token}, relations: ["user"]});
    }

    findOneByUserIdAndEmail(userId: string, email: string): Promise<ConfirmEmailToken | undefined> {
        return this.repository.findOne({where: {email, userId}, order: {expires: "DESC"}})
    }

    async remove(token: ConfirmEmailToken): Promise<void> {
        await this.repository.remove(token);
    }

    async save(token: ConfirmEmailToken): Promise<void> {
        await this.repository.save(token);
    }


}