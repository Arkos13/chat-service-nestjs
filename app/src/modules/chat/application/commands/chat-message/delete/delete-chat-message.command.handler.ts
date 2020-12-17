import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {DeleteChatMessageCommand} from "./delete-chat-message.command";
import {ChatMessageRepository} from "../../../../infrastructure/repositories/chat-message.repository";
import {ChatMessageFileRepository} from "../../../../infrastructure/repositories/chat-message-file.repository";
import {FileSystem} from "../../../../../../shared/services/file/system/file-system";

@CommandHandler(DeleteChatMessageCommand)
export class DeleteChatMessageCommandHandler implements ICommandHandler<DeleteChatMessageCommand> {

    constructor(
        private readonly chatMessageRepository: ChatMessageRepository,
        private readonly chatMessageFileRepository: ChatMessageFileRepository,
        private readonly fileSystem: FileSystem,
    ) {}

    async execute(command: DeleteChatMessageCommand): Promise<void> {
        const chatMessage = await this.chatMessageRepository.getOneById(command.messageId);
        const files = await this.chatMessageFileRepository.findAllByChatMessageId(command.messageId);
        for await (let file of files) {
            await this.chatMessageFileRepository.remove(file);
            this.fileSystem.remove(file.path);
        }
        await this.chatMessageRepository.remove(chatMessage);
    }

}