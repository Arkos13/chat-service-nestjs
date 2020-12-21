import {
    BadRequestException,
    Body,
    Controller,
    HttpCode, Inject, Logger,
    Param,
    Put,
    UseGuards,
    UseInterceptors,
    ValidationPipe
} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {CommandBus, QueryBus} from "@nestjs/cqrs";
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {ChatMessageDto} from "../../../../application/queries/dto/chat-message.dto";
import {User} from "../../../../../user/model/entities/user.entity";
import {GetUser} from "../../../../../../infrastructure/decorators/get-user.decorator";
import {GetChatMessageByIdQuery} from "../../../../application/queries/chat-message/get-chat-message-by-id/get-chat-message-by-id.query";
import {EditChatMessageRequest} from "../../requests/edit-chat-message.request";
import {EditChatMessageCommand} from "../../../../application/commands/chat-message/edit/edit-chat-message.command";
import {ManageChatMessageInterceptor} from "../../../../infrastructure/interceptors/manage-chat-message.interceptor";
import {PublishMessageInterface} from "../../../../application/services/publish-message/publish-message.interface";
import {EDITED_MESSAGE_EVENT} from "../../../../application/services/publish-message/event-message";

@ApiTags('Chat (message)')
@Controller('api/chats/:chatId/messages/:messageId')
@UseGuards(AuthGuard('jwt'))
export class EditChatMessageAction {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        @Inject('PublishMessageInterface')
        private readonly publishMessage: PublishMessageInterface,
        private readonly logger: Logger,
    ) {}

    @Put()
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        type: ChatMessageDto
    })
    @ApiBearerAuth()
    @UseInterceptors(ManageChatMessageInterceptor)
    public async action(
        @Body(new ValidationPipe({transform: true})) request: EditChatMessageRequest,
        @GetUser() currentUser: User,
        @Param() params,
    ): Promise<ChatMessageDto> {
        try {
            const id = params.messageId;
            await this.commandBus.execute(
                new EditChatMessageCommand(
                    id,
                    request.message,
                )
            );

            const chatMessage = await this.queryBus.execute(new GetChatMessageByIdQuery(id));

            this.publishMessage.publishToChat(
                params.chatId,
                EDITED_MESSAGE_EVENT,
                chatMessage
            ).catch((err) => this.logger.log('warn', err));

            return chatMessage;
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }
}
