import {BadRequestException, Controller, HttpCode, ValidationPipe, Post, Body} from "@nestjs/common"
import {CommandBus} from "@nestjs/cqrs";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "../../../../model/entities/user.entity";
import {ConfirmEmailRequest} from "../../requests/confirm-email.request";
import {ConfirmEmailCommand} from "../../../../application/commands/email/confirm-email/confirm-email.command";

@ApiTags('User')
@Controller('api/users/email/confirm')
export class ConfirmEmailAction {

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
        @Body(ValidationPipe) request: ConfirmEmailRequest,
    ): Promise<boolean> {
        try {
            await this.commandBus.execute(
                new ConfirmEmailCommand(request.token)
            );
            return true;
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }
}
