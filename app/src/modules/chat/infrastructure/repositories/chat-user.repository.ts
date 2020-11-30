import {EntityManager, Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {ChatUserRepositoryInterface} from "../../model/repositories/chat-user.repository.interface";
import {ChatUser} from "../../model/entities/chat-user.entity";

@Injectable()
export class ChatUserRepository implements ChatUserRepositoryInterface {

    private repository: Repository<ChatUser>;

    constructor(
        private readonly em: EntityManager,
    ) {
        this.repository = em.getRepository<ChatUser>(ChatUser);
    }

    findDeletedByChatId(chatId: string): Promise<ChatUser[]> {
        return this.repository.find({where: {isDeleted: true}});
    }

    async save(chatUser: ChatUser): Promise<void> {
        await this.repository.save(chatUser);
    }

    getOneByChatIdAndUserId(chatId: string, userId: string): Promise<ChatUser> {
        return this.repository.findOneOrFail({where: {chatId, userId}})
    }

}