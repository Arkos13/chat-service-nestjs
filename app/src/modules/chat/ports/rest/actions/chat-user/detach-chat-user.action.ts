import {
    BadRequestException,
    Controller,
    Delete,
    HttpCode, Inject, Logger,
    Param,
    UseGuards, UseInterceptors,
} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {CommandBus} from "@nestjs/cqrs";
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {DetachChatUserCommand} from "../../../../application/commands/chat-user/detach/detach-chat-user.command";
import {User} from "../../../../../user/model/entities/user.entity";
import {GetUser} from "../../../../../../infrastructure/decorators/get-user.decorator";
import {ReadChatInterceptor} from "../../../../infrastructure/interceptors/read-chat.interceptor";
import {PublishMessageInterface} from "../../../../application/services/publish-message/publish-message.interface";
import {DETACHED_CHAT_USER_EVENT} from "../../../../application/services/publish-message/event-message";

@ApiTags('Chat (user)')
@Controller('api/chats/:id/users/detach')
@UseGuards(AuthGuard('jwt'))
export class DetachChatUserAction {
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
    @UseInterceptors(ReadChatInterceptor)
    public async action(
        @Param() params,
        @GetUser() currentUser: User,
    ): Promise<boolean> {
        try {
            await this.commandBus.execute(
                new DetachChatUserCommand(
                    params.id,
                    currentUser.id
                )
            );

            this.publishMessage.publishToChat(
                params.id,
                DETACHED_CHAT_USER_EVENT,
                {
                    chatId: params.id,
                    userId: currentUser.id,
                }
            ).catch((err) => this.logger.log('warn', err));

            return true;
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }
}
