import {BadRequestException, Controller, Delete, HttpCode, Param, UseGuards, UseInterceptors} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {CommandBus} from "@nestjs/cqrs";
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "../../../../../user/model/entities/user.entity";
import {GetUser} from "../../../../../../infrastructure/decorators/get-user.decorator";
import {DeleteChatMessageCommand} from "../../../../application/commands/chat-message/delete/delete-chat-message.command";
import {ManageChatMessageInterceptor} from "../../../../infrastructure/interceptors/manage-chat-message.interceptor";

@ApiTags('Chat (message)')
@Controller('api/chats/:chatId/messages/:messageId')
@UseGuards(AuthGuard('jwt'))
export class DeleteChatMessageAction {
    constructor(
        private readonly commandBus: CommandBus,
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
            return true;
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }
}
