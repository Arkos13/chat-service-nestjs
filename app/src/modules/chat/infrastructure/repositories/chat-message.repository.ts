import {EntityManager, Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {ChatMessageRepositoryInterface} from "../../model/repositories/chat-message.repository.interface";
import {ChatMessage} from "../../model/entities/chat-message.entity";

@Injectable()
export class ChatMessageRepository implements ChatMessageRepositoryInterface {

    private repository: Repository<ChatMessage>;

    constructor(
        private readonly em: EntityManager,
    ) {
        this.repository = em.getRepository<ChatMessage>(ChatMessage);
    }

    async getCountNewMessagesByUserIdAndChatId(userId: string, chatId: string): Promise<number> {
        const result = await this.em.connection
            .createQueryBuilder()
            .select("count(cm.id) as count")
            .from("chat_messages", "cm")
            .innerJoin("chat_users", "cu", "cm.chatId = cu.chatId")
            .andWhere("cm.chatId = :chatId")
            .andWhere("cu.userId = :userId")
            .andWhere("cm.userId != :userId")
            .andWhere("string_to_array(cm.userReads, ',') && string_to_array(:userId, ',') = 'f'")
            .setParameter("chatId", chatId)
            .setParameter("userId", userId)
            .getRawOne();

        return +result.count;
    }

    async findLastMessageByChatId(chatId: string): Promise<ChatMessage|undefined> {
        const message = await this.em.connection
            .createQueryBuilder()
            .select("distinct on (cm.chatId) cm.chatId, cm.id")
            .from("chat_messages", "cm")
            .orderBy("cm.chatId")
            .addOrderBy("cm.created", "DESC")
            .take(1)
            .getRawOne()

        if (typeof message === 'undefined') {
            return undefined;
        }

        return this.repository.findOne({where: {id: message.id}, relations: ["user"]});
    }

    getOneByIdAndChatId(id: string, chatId: string): Promise<ChatMessage> {
        return this.repository.findOneOrFail({ where: {id, chatId}});
    }

    async getOneById(id: string): Promise<ChatMessage> {
        return this.repository.findOneOrFail({
            where: {id},
            relations: ['user', 'user.profile', 'chat', 'parent']
        });
    }

    async save(message: ChatMessage): Promise<void> {
        await this.repository.save(message);
    }

    async remove(message: ChatMessage): Promise<void> {
        await this.repository.remove(message);
    }
}