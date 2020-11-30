import {
    BadRequestException,
    Controller,
    Delete,
    HttpCode,
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

@ApiTags('Chat (user)')
@Controller('api/chats/:id/users/detach')
@UseGuards(AuthGuard('jwt'))
export class DetachChatUserAction {
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

            return true;
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }
}
