import {BadRequestException, Controller, HttpCode, ValidationPipe, Post, Body} from "@nestjs/common"
import {CommandBus} from "@nestjs/cqrs";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "../../../../model/entities/user.entity";
import {RecoveryPasswordCommand} from "../../../../application/commands/password/recovery/recovery-password.command";
import {RecoveryPasswordRequest} from "../../requests/recovery-password.request";

@ApiTags('User')
@Controller('api/users/recovery_password')
export class RecoveryPasswordAction {

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
        @Body(ValidationPipe) request: RecoveryPasswordRequest,
    ): Promise<boolean> {
        try {
            await this.commandBus.execute(
                new RecoveryPasswordCommand(request.token, request.password)
            );
            return true;
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }
}
