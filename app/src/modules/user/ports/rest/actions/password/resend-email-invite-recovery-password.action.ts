import {BadRequestException, Controller, HttpCode, ValidationPipe, Post, Body} from "@nestjs/common"
import {CommandBus} from "@nestjs/cqrs";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {EmailInviteRequest} from "../../requests/email-invite.request";
import {User} from "../../../../model/entities/user.entity";
import {SendInviteRecoveryPasswordCommand} from "../../../../application/commands/password/send-invite-recovery/send-invite-recovery-password.command";

@ApiTags('User')
@Controller('api/users/resend_email_invite_recovery_password')
export class ResendEmailInviteRecoveryPasswordAction {

    constructor(
        private readonly commandBus: CommandBus,
    ) {}

    @Post()
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        type: Boolean
    })
    public async action(
        @Body(ValidationPipe) request: EmailInviteRequest,
    ): Promise<boolean> {
        try {
            await this.commandBus.execute(
                new SendInviteRecoveryPasswordCommand(request.email)
            );
            return true;
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }
}
