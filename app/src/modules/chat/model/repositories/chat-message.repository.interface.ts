import {ChatMessage} from "../entities/chat-message.entity";

export interface ChatMessageRepositoryInterface {
    findLastMessageByChatId(chatId: string): Promise<ChatMessage|undefined>;
    getCountNewMessagesByUserIdAndChatId(userId: string, chatId: string): Promise<number>;
}