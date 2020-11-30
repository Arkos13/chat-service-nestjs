import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {PaginatedData} from "../../../../../infrastructure/value-object/paginated-data";
import {ChatRepository} from "../../../infrastructure/repositories/chat.repository";
import {ChatMessageRepository} from "../../../infrastructure/repositories/chat-message.repository";
import {GetChatsByUserQuery} from "./get-chats-by-user.query";
import {Chat} from "../../../model/entities/chat.entity";
import {ChatDto} from "../dto/chat.dto";

@QueryHandler(GetChatsByUserQuery)
export class GetChatsByUserQueryHandler implements IQueryHandler<GetChatsByUserQuery> {

    constructor(
        private readonly chatRepository: ChatRepository,
        private readonly chatMessageRepository: ChatMessageRepository,
    ) {}

    async execute(query: GetChatsByUserQuery): Promise<PaginatedData<ChatDto>> {
        const chats = await this.chatRepository.getByUserId(query.userId, query.page, query.limit);
        const count = await this.chatRepository.getCountByUserId(query.userId);

        return new PaginatedData<ChatDto>(
            count,
            Math.ceil(count / query.limit),
            await Promise.all(chats.map(async (chat: Chat) => {
                const lastMessage = await this.chatMessageRepository.findLastMessageByChatId(chat.id);
                const countNewMessages = await this.chatMessageRepository.getCountNewMessagesByUserIdAndChatId(
                    query.userId,
                    chat.id,
                );
                return new ChatDto(
                    chat.id,
                    chat.title,
                    chat.created,
                    chat.updated,
                    countNewMessages,
                    lastMessage?.getSimpleDate()
                );
            }))
        );
    }

}