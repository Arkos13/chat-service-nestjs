import {BadRequestException, Controller, HttpCode, ValidationPipe, Post, UseGuards, Body} from "@nestjs/common"
import {CommandBus} from "@nestjs/cqrs";
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {EmailInviteRequest} from "../../requests/email-invite.request";
import {SendChangeInviteCommand} from "../../../../application/commands/email/send-change-invite/send-change-invite.command";
import {GetUser} from "../../../../../../infrastructure/decorators/get-user.decorator";
import {User} from "../../../../model/entities/user.entity";
import {AuthGuard} from "@nestjs/passport";

@ApiTags('User')
@Controller('api/users/email/send_change_email_invite')
@UseGuards(AuthGuard('jwt'))
export class SendChangeEmailInviteAction {

    constructor(
        private readonly commandBus: CommandBus,
    ) {}

    @Post()
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        type: Boolean
    })
    @ApiBearerAuth()
    public async action(
        @Body(ValidationPipe) request: EmailInviteRequest,
        @GetUser() currentUser: User
    ): Promise<boolean> {
        try {
            await this.commandBus.execute(
                new SendChangeInviteCommand(currentUser.email, request.email)
            );
            return true;
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }
}
