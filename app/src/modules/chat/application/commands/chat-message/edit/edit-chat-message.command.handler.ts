import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {EditChatMessageCommand} from "./edit-chat-message.command";
import {ChatMessageRepository} from "../../../../infrastructure/repositories/chat-message.repository";

@CommandHandler(EditChatMessageCommand)
export class EditChatMessageCommandHandler implements ICommandHandler<EditChatMessageCommand> {
    constructor(
        private readonly repository: ChatMessageRepository,
    ) {}

    async execute(command: EditChatMessageCommand): Promise<void> {
        const chatMessage = await this.repository.getOneById(command.messageId);
        chatMessage.message = command.message;
        await this.repository.save(chatMessage);
    }

}