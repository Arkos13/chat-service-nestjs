import {Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {UserModule} from "../user/user.module";
import {CreateChatAction} from "./ports/rest/actions/create-chat.action";
import {GetChatsByUserAction} from "./ports/rest/actions/get-chats-by-user.action";
import {CreateChatCommandHandler} from "./application/commands/create-chat/create-chat.command.handler";
import {GetChatQueryHandler} from "./application/queries/get-chat/get-chat.query.handler";
import {GetChatsByUserQueryHandler} from "./application/queries/get-chats-by-user/get-chats-by-user.query.handler";
import {Chat} from "./model/entities/chat.entity";
import {ChatMessage} from "./model/entities/chat-message.entity";
import {ChatUser} from "./model/entities/chat-user.entity";
import {ChatMessageFile} from "./model/entities/chat-message-file.entity";
import {CqrsModule} from "@nestjs/cqrs";
import {JwtModule} from "@nestjs/jwt";
import {ChatRepository} from "./infrastructure/repositories/chat.repository";
import {ChatMessageRepository} from "./infrastructure/repositories/chat-message.repository";
import {ChatUserRepository} from "./infrastructure/repositories/chat-user.repository";
import {ReadChatInterceptor} from "./infrastructure/interceptors/read-chat.interceptor";
import {DetachChatUserAction} from "./ports/rest/actions/chat-user/detach-chat-user.action";
import {DetachChatUserCommandHandler} from "./application/commands/chat-user/detach/detach-chat-user.command.handler";

const CommandHandlers = [CreateChatCommandHandler, DetachChatUserCommandHandler];
const QueryHandlers = [GetChatQueryHandler, GetChatsByUserQueryHandler];
const Interceptors = [ReadChatInterceptor];

@Module({
    imports: [
        TypeOrmModule.forFeature([Chat, ChatMessage, ChatUser, ChatMessageFile]),
        UserModule,
        CqrsModule,
        JwtModule.register({
            publicKey: process.env.PUBLIC_KEY,
            privateKey: process.env.PRIVATE_KEY,
            signOptions: {
                expiresIn: process.env.EXPIRES_IN,
                algorithm: 'RS256',
            }
        }),
    ],
    controllers: [
        CreateChatAction,
        GetChatsByUserAction,
        DetachChatUserAction,
    ],
    providers: [
        ...CommandHandlers,
        ...QueryHandlers,
        ...Interceptors,
        ChatRepository,
        ChatMessageRepository,
        ChatUserRepository,
    ]
})
export class ChatModule {}
