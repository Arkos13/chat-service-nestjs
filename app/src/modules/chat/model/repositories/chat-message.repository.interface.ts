import {ChatMessage} from "../entities/chat-message.entity";

export interface ChatMessageRepositoryInterface {
    findLastMessageByChatId(chatId: string): Promise<ChatMessage|undefined>;
    getCountNewMessagesByUserIdAndChatId(userId: string, chatId: string): Promise<number>;
    getOneByIdAndChatId(id: string, chatId: string): Promise<ChatMessage>
    getOneById(id: string): Promise<ChatMessage>
    save(message: ChatMessage): Promise<void>;
    remove(message: ChatMessage): Promise<void>;
}