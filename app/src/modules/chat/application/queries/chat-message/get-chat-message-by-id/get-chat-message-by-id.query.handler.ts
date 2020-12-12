import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {GetChatMessageByIdQuery} from "./get-chat-message-by-id.query";
import {ChatMessageRepository} from "../../../../infrastructure/repositories/chat-message.repository";
import {ChatMessageDto} from "../../dto/chat-message.dto";
import {ChatMessageFileRepository} from "../../../../infrastructure/repositories/chat-message-file.repository";
import {ChatMessageFile} from "../../../../model/entities/chat-message-file.entity";

@QueryHandler(GetChatMessageByIdQuery)
export class GetChatMessageByIdQueryHandler implements IQueryHandler<GetChatMessageByIdQuery> {

    constructor(
        private readonly repository: ChatMessageRepository,
        private readonly chatMessageFileRepository: ChatMessageFileRepository,
    ) {}

    async execute(query: GetChatMessageByIdQuery): Promise<ChatMessageDto> {
        const chatMessage = await this.repository.getOneById(query.id);
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
    }

}