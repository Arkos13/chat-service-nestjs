import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Inject, Logger,
    Param,
    Post,
    UseGuards,
    ValidationPipe
} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {CommandBus, QueryBus} from "@nestjs/cqrs";
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {v4 as uuidv4} from "uuid";
import {ChatMessageDto} from "../../../../application/queries/dto/chat-message.dto";
import {ChatMessageRequest} from "../../requests/chat-message.request";
import {User} from "../../../../../user/model/entities/user.entity";
import {GetUser} from "../../../../../../infrastructure/decorators/get-user.decorator";
import {CreateChatMessageCommand} from "../../../../application/commands/chat-message/create/create-chat-message.command";
import {GetChatMessageByIdQuery} from "../../../../application/queries/chat-message/get-chat-message-by-id/get-chat-message-by-id.query";
import {PublishMessageInterface} from "../../../../application/services/publish-message/publish-message.interface";
import {
    CREATED_MESSAGE_EVENT
} from "../../../../application/services/publish-message/event-message";

@ApiTags('Chat (message)')
@Controller('api/chats/:chatId/messages/new')
@UseGuards(AuthGuard('jwt'))
export class CreateChatMessageAction {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        @Inject('PublishMessageInterface')
        private readonly publishMessage: PublishMessageInterface,
        private readonly logger: Logger,
    ) {}

    @Post()
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        type: ChatMessageDto
    })
    @ApiBearerAuth()
    public async action(
        @Body(new ValidationPipe({transform: true})) request: ChatMessageRequest,
        @GetUser() currentUser: User,
        @Param() params,
    ): Promise<ChatMessageDto> {
        try {
            const id = uuidv4();
            const fileIds = Array.from(
                new Set([
                    ...request.fileIds,
                ])
            );
            await this.commandBus.execute(
                new CreateChatMessageCommand(
                    id,
                    params.chatId,
                    currentUser.id,
                    request.message,
                    request.parentId,
                    fileIds
                )
            );

            const chatMessage = await this.queryBus.execute(new GetChatMessageByIdQuery(id));

            this.publishMessage.publishToChat(
                params.chatId,
                CREATED_MESSAGE_EVENT,
                chatMessage
            ).catch((err) => this.logger.log('warn', err));

            return chatMessage;
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }
}
