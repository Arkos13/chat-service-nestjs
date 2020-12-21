import {ChatUser} from "../entities/chat-user.entity";

export interface ChatUserRepositoryInterface {
    findDeletedByChatId(chatId: string): Promise<ChatUser[]>;
    save(chatUser: ChatUser): Promise<void>;
    getOneByChatIdAndUserId(chatId: string, userId: string): Promise<ChatUser>
    getUsersEmail(chatId: string): Promise<string[]>;
}