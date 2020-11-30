import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {DetachChatUserCommand} from "./detach-chat-user.command";
import {ChatUserRepository} from "../../../../infrastructure/repositories/chat-user.repository";

@CommandHandler(DetachChatUserCommand)
export class DetachChatUserCommandHandler implements ICommandHandler {
    constructor(
        private readonly repository: ChatUserRepository,
    ) {}

    async execute(command: DetachChatUserCommand): Promise<void> {
        const chatUser = await this.repository.getOneByChatIdAndUserId(command.chatId, command.userId);
        chatUser.isDeleted = true;
        await this.repository.save(chatUser);
    }

}