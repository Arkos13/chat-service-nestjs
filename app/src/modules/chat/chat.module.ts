import {Logger, Module} from '@nestjs/common';
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
import {CreateChatMessageFileAction} from "./ports/rest/actions/chat-message/file/create-chat-message-file.action";
import {MulterModule} from "@nestjs/platform-express";
import {MulterConfigService} from "./infrastructure/services/multer-config.service";
import {CreateFileCommandHandler} from "./application/commands/chat-message/create-file/create-file.command.handler";
import {GetFileByIdQueryHandler} from "./application/queries/chat-message/get-file-by-id/get-file-by-id.query.handler";
import {ChatMessageFileRepository} from "./infrastructure/repositories/chat-message-file.repository";
import {CreateChatMessageCommandHandler} from "./application/commands/chat-message/create/create-chat-message.command.handler";
import {GetChatMessageByIdQueryHandler} from "./application/queries/chat-message/get-chat-message-by-id/get-chat-message-by-id.query.handler";
import {CreateChatMessageAction} from "./ports/rest/actions/chat-message/create-chat-message.action";
import {DeleteChatMessageCommandHandler} from "./application/commands/chat-message/delete/delete-chat-message.command.handler";
import {DeleteChatMessageAction} from "./ports/rest/actions/chat-message/delete-chat-message.action";
import {FileSystem} from "../../shared/services/file/system/file-system";
import {ManageChatMessageInterceptor} from "./infrastructure/interceptors/manage-chat-message.interceptor";
import {GetChatMessagesQueryHandler} from "./application/queries/chat-message/get-chat-messages/get-chat-messages.query.handler";
import {GetChatMessagesAction} from "./ports/rest/actions/chat-message/get-chat-messages.action";
import {EditChatMessageCommandHandler} from "./application/commands/chat-message/edit/edit-chat-message.command.handler";
import {EditChatMessageAction} from "./ports/rest/actions/chat-message/edit-chat-message.action";
import {CentrifugeModule} from "../centrifuge/centrifuge.module";
import {CentrifugoPublishMessage} from "./application/services/publish-message/centrifugo-publish-message";

const CommandHandlers = [
    CreateChatCommandHandler,
    DetachChatUserCommandHandler,
    CreateFileCommandHandler,
    CreateChatMessageCommandHandler,
    DeleteChatMessageCommandHandler,
    EditChatMessageCommandHandler,
];
const QueryHandlers = [
    GetChatQueryHandler,
    GetChatsByUserQueryHandler,
    GetFileByIdQueryHandler,
    GetChatMessageByIdQueryHandler,
    GetChatMessagesQueryHandler,
];
const Interceptors = [ReadChatInterceptor, ManageChatMessageInterceptor];

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
        MulterModule.registerAsync({
            useClass: MulterConfigService,
        }),
        CentrifugeModule,
    ],
    controllers: [
        CreateChatAction,
        GetChatsByUserAction,
        DetachChatUserAction,
        CreateChatMessageFileAction,
        CreateChatMessageAction,
        DeleteChatMessageAction,
        GetChatMessagesAction,
        EditChatMessageAction,
    ],
    providers: [
        ...CommandHandlers,
        ...QueryHandlers,
        ...Interceptors,
        ChatRepository,
        ChatMessageRepository,
        ChatUserRepository,
        ChatMessageFileRepository,
        FileSystem,
        {
            provide: 'PublishMessageInterface',
            useClass: CentrifugoPublishMessage,
        },
        Logger,
    ]
})
export class ChatModule {}
