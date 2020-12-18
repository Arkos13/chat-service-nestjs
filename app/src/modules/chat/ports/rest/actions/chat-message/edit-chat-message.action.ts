import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
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

@ApiTags('Chat (message)')
@Controller('api/chats/:chatId/messages/:messageId')
@UseGuards(AuthGuard('jwt'))
export class EditChatMessageAction {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
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
            return await this.queryBus.execute(new GetChatMessageByIdQuery(id));
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }
}
