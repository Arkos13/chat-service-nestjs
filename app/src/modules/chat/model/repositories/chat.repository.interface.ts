import {Chat} from "../entities/chat.entity";

export interface ChatRepositoryInterface {
    findChatByUserIds(userIds: string[]): Promise<Chat | undefined>;
    findOneById(chatId: string): Promise<Chat | undefined>;
    getByUserId(userId: string, page: number, limit: number): Promise<Chat[]>;
    getCountByUserId(userId: string): Promise<number>;
    save(chat: Chat): Promise<void>;
}