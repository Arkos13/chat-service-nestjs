import {ChatMessageFile} from "../entities/chat-message-file.entity";

export interface ChatMessageFileRepositoryInterface {
    save(file: ChatMessageFile): Promise<void>;
    getOneById(id: string): Promise<ChatMessageFile>;
}