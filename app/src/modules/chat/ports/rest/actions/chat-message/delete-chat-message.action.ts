import {
    BadRequestException,
    Controller,
    Delete,
    HttpCode,
    Inject, Logger,
    Param,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {CommandBus} from "@nestjs/cqrs";
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "../../../../../user/model/entities/user.entity";
import {GetUser} from "../../../../../../infrastructure/decorators/get-user.decorator";
import {DeleteChatMessageCommand} from "../../../../application/commands/chat-message/delete/delete-chat-message.command";
import {ManageChatMessageInterceptor} from "../../../../infrastructure/interceptors/manage-chat-message.interceptor";
import {PublishMessageInterface} from "../../../../application/services/publish-message/publish-message.interface";
import {DELETED_MESSAGE_EVENT} from "../../../../application/services/publish-message/event-message";

@ApiTags('Chat (message)')
@Controller('api/chats/:chatId/messages/:messageId')
@UseGuards(AuthGuard('jwt'))
export class DeleteChatMessageAction {
    constructor(
        private readonly commandBus: CommandBus,
        @Inject('PublishMessageInterface')
        private readonly publishMessage: PublishMessageInterface,
        private readonly logger: Logger,
    ) {}

    @Delete()
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        type: Boolean
    })
    @ApiBearerAuth()
    @UseInterceptors(ManageChatMessageInterceptor)
    public async action(
        @GetUser() currentUser: User,
        @Param() params,
    ): Promise<boolean> {
        try {
            await this.commandBus.execute(
                new DeleteChatMessageCommand(
                    params.messageId,
                )
            );

            this.publishMessage.publishToChat(
                params.chatId,
                DELETED_MESSAGE_EVENT,
                {
                    id: params.messageId,
                    chatId: params.chatId,
                }
            ).catch((err) => this.logger.log('warn', err));

            return true;
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }
}
