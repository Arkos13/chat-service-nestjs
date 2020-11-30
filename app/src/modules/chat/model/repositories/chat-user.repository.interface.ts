import {ChatUser} from "../entities/chat-user.entity";

export interface ChatUserRepositoryInterface {
    findDeletedByChatId(chatId: string): Promise<ChatUser[]>;
    save(chatUser: ChatUser): Promise<void>;
}