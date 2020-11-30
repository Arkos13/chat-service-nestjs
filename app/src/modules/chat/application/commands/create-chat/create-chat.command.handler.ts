import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {CreateChatCommand} from "./create-chat.command";
import {UserRepository} from "../../../../user/infrastructure/repositories/user.repository";
import {ChatRepository} from "../../../infrastructure/repositories/chat.repository";
import {User} from "../../../../user/model/entities/user.entity";
import {UserNotFoundError} from "../../../../user/model/exceptions/user-not-found.error";
import {ChatUserRepository} from "../../../infrastructure/repositories/chat-user.repository";
import {Chat} from "../../../model/entities/chat.entity";
import {ChatUser} from "../../../model/entities/chat-user.entity";

@CommandHandler(CreateChatCommand)
export class CreateChatCommandHandler implements ICommandHandler<CreateChatCommand> {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly chatRepository: ChatRepository,
        private readonly chatUserRepository: ChatUserRepository,
    ) {}

    async execute(command: CreateChatCommand): Promise<any> {
        const users: User[] = await Promise.all(command.userIds.map(
            async (id: string) => {
                const user = await this.userRepository.findOneById(id);
                if (typeof user === 'undefined') {
                    throw new UserNotFoundError();
                }
                return user;
            }
        ));

        const existsChat = await this.chatRepository.findChatByUserIds(command.userIds);

        if (typeof existsChat !== 'undefined') {
            await this.unlockChat(existsChat.id);
            existsChat.setUpdatedNow();
            await this.chatRepository.save(existsChat);
            return;
        }

        const chat = Chat.create(command.id, command.title);
        await this.chatRepository.save(chat);

        for await (const user of users) {
            await this.chatUserRepository.save(
                ChatUser.create(user, chat)
            );
        }
    }

    private async unlockChat(chatId: string): Promise<void> {
        const chatUsers = await this.chatUserRepository.findDeletedByChatId(chatId);
        for await (const chatUser of chatUsers) {
            chatUser.isDeleted = false;
            await this.chatUserRepository.save(chatUser);
        }
    }

}