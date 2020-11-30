import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {GetChatQuery} from "./get-chat.query";
import {ChatRepository} from "../../../infrastructure/repositories/chat.repository";
import {ChatMessageRepository} from "../../../infrastructure/repositories/chat-message.repository";
import {ChatNotFoundError} from "../../../model/exceptions/chat-not-found.error";
import {ChatDto} from "../dto/chat.dto";

@QueryHandler(GetChatQuery)
export class GetChatQueryHandler implements IQueryHandler<GetChatQuery> {

    constructor(
        private readonly chatRepository: ChatRepository,
        private readonly chatMessageRepository: ChatMessageRepository,
    ) {}

    async execute(query: GetChatQuery): Promise<ChatDto> {
        const chat = await this.chatRepository.findChatByUserIds(query.userIds);

        if (typeof chat === 'undefined') {
            throw new ChatNotFoundError();
        }

        const lastMessage = await this.chatMessageRepository.findLastMessageByChatId(chat.id);
        const countNewMessages = await this.chatMessageRepository.getCountNewMessagesByUserIdAndChatId(
            query.currentUserId,
            chat.id,
        );

        return new ChatDto(
            chat.id,
            chat.title,
            chat.created,
            chat.updated,
            countNewMessages,
            lastMessage?.getSimpleDate(),
        );
    }

}