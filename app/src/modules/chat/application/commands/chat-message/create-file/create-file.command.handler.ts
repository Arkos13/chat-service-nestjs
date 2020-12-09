import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {CreateFileCommand} from "./create-file.command";
import {ChatMessageFileRepository} from "../../../../infrastructure/repositories/chat-message-file.repository";
import {ChatMessageFile} from "../../../../model/entities/chat-message-file.entity";

@CommandHandler(CreateFileCommand)
export class CreateFileCommandHandler implements ICommandHandler<CreateFileCommand> {

    constructor(
        private readonly repository: ChatMessageFileRepository,
    ) {}

    async execute(command: CreateFileCommand): Promise<void> {
        await this.repository.save(
            ChatMessageFile.create(
                command.id,
                command.path,
                command.mimeType,
                command.originalName,
                command.name,
                command.size
            )
        );
    }

}