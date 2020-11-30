import {EntityManager, Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {ChatRepositoryInterface} from "../../model/repositories/chat.repository.interface";
import {Chat} from "../../model/entities/chat.entity";

@Injectable()
export class ChatRepository implements ChatRepositoryInterface {

    private repository: Repository<Chat>;

    constructor(
        private readonly em: EntityManager,
    ) {
        this.repository = em.getRepository<Chat>(Chat);
    }

    async findChatByUserIds(userIds: string[]): Promise<Chat | undefined> {
        const chat = await this.em.connection.createQueryBuilder()
            .select("c.id as id, c.title as title, c.created as created, c.updated as updated")
            .from("chats", "c")
            .innerJoin("chat_users", "cu", "c.id = cu.chatId")
            .groupBy("c.id")
            .having("string_agg(cast(cu.userId as varchar),'_' order by cu.userId) = :chainUsersId")
            .setParameter("chainUsersId", userIds.sort().join("_"))
            .getRawOne()

        if (typeof chat === 'undefined') {
            return undefined;
        }

        return Chat.fromData(chat.id, chat.title, chat.created, chat.updated);
    }

    async save(chat: Chat): Promise<void> {
        await this.repository.save(chat);
    }

    findOneById(chatId: string): Promise<Chat | undefined> {
        return this.repository.findOne({where: {id: chatId}});
    }

    async getByUserId(userId: string, page: number, limit: number): Promise<Chat[]> {
        const chats = await this.em.connection.createQueryBuilder()
            .select("c.id, c.title, c.created, c.updated")
            .from("chats", "c")
            .innerJoin("chat_users", "cu", "c.id = cu.chatId")
            .andWhere("cu.userId = :userId")
            .andWhere("cu.isDeleted = 'f'")
            .setParameter("userId", userId)
            .orderBy("c.created", "DESC")
            .take(limit)
            .offset((page - 1) * limit)
            .getRawMany()

        return chats.map((chat: any) => Chat.fromData(chat.id, chat.title, chat.created, chat.updated));
    }

    async getCountByUserId(userId: string): Promise<number> {
        const result = await this.em.connection.createQueryBuilder()
            .select("count(c.id)")
            .from("chats", "c")
            .innerJoin("chat_users", "cu", "c.id = cu.chatId")
            .andWhere("cu.userId = :userId")
            .andWhere("cu.isDeleted = 'f'")
            .setParameter("userId", userId)
            .getRawOne();

        return +result.count;
    }

}