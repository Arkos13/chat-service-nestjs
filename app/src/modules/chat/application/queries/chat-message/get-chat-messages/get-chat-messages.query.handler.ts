import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {GetChatMessagesQuery} from "./get-chat-messages.query";
import {PaginatedData} from "../../../../../../infrastructure/value-object/paginated-data";
import {ChatMessageDto} from "../../dto/chat-message.dto";
import {ChatMessageRepository} from "../../../../infrastructure/repositories/chat-message.repository";
import {ChatMessage} from "../../../../model/entities/chat-message.entity";
import {ChatMessageFile} from "../../../../model/entities/chat-message-file.entity";
import {ChatMessageFileRepository} from "../../../../infrastructure/repositories/chat-message-file.repository";

@QueryHandler(GetChatMessagesQuery)
export class GetChatMessagesQueryHandler implements IQueryHandler<GetChatMessagesQuery> {
    constructor(
        private readonly repository: ChatMessageRepository,
        private readonly chatMessageFileRepository: ChatMessageFileRepository,
    ) {}

    async execute(query: GetChatMessagesQuery): Promise<PaginatedData<ChatMessageDto>> {
        const count = await this.repository.getCountByChatId(query.chatId);
        const messages = await this.repository.getByChatId(query.chatId, query.page, query.limit);

        return new PaginatedData<ChatMessageDto>(
            count,
            Math.ceil(count / query.limit),
            await Promise.all(messages.map(async (chatMessage: ChatMessage) => {
                const files = await this.chatMessageFileRepository.findAllByChatMessageId(chatMessage.id);
                return new ChatMessageDto(
                    chatMessage.id,
                    {
                        id: chatMessage.chat.id,
                        title: chatMessage.chat.title,
                        created: chatMessage.chat.created,
                    },
                    chatMessage.message,
                    chatMessage.created,
                    chatMessage.updated,
                    chatMessage.type,
                    {
                        id: chatMessage.user.id,
                        firstName: chatMessage.getFirstNameUser(),
                        lastName: chatMessage.getLastNameUser(),
                    },
                    files.map((file: ChatMessageFile) => {
                        return {
                            id: file.id,
                            name: file.name,
                            path: file.path,
                            mimeType: file.mimeType,
                            size: file.size,
                        };
                    }),
                    chatMessage.parent?.id
                );
            }))
        );
    }

}