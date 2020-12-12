import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {ChatMessageFileRepository} from "../../../../infrastructure/repositories/chat-message-file.repository";
import {ChatMessageRepository} from "../../../../infrastructure/repositories/chat-message.repository";
import {ChatUserRepository} from "../../../../infrastructure/repositories/chat-user.repository";
import {CreateChatMessageCommand} from "./create-chat-message.command";
import {ChatMessage, ChatMessageType} from "../../../../model/entities/chat-message.entity";

@CommandHandler(CreateChatMessageCommand)
export class CreateChatMessageCommandHandler implements ICommandHandler<CreateChatMessageCommand> {

    constructor(
        private readonly chatMessageFileRepository: ChatMessageFileRepository,
        private readonly chatMessageRepository: ChatMessageRepository,
        private readonly chatUserRepository: ChatUserRepository,
    ) {}

    async execute(command: CreateChatMessageCommand): Promise<void> {
        const chatUser = await this.chatUserRepository.getOneByChatIdAndUserId(command.chatId, command.userId);

        let parentMessage = null;
        let type: ChatMessageType = 'simple';
        if (typeof command.parentId !== 'undefined') {
            parentMessage = await this.chatMessageRepository.getOneByIdAndChatId(command.parentId, command.chatId);
            type = 'quote';
        }

        const chatMessage = ChatMessage.create(
            command.id,
            chatUser.user,
            chatUser.chat,
            type,
            command.message
        );
        chatMessage.parent = parentMessage;
        await this.chatMessageRepository.save(chatMessage);

        if (typeof command.filesIds !== 'undefined') {
            for (let fileId of command.filesIds) {
                const file = await this.chatMessageFileRepository.getOneByIdWithoutMessage(fileId);
                file.chatMessage = chatMessage;
                await this.chatMessageFileRepository.save(file);
            }
        }
    }

}