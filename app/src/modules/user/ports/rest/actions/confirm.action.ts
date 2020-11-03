import {BadRequestException, Query, Controller, HttpCode, ValidationPipe, Post} from "@nestjs/common"
import {CommandBus} from "@nestjs/cqrs";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {ConfirmRequest} from "../requests/confirm.request";
import {ConfirmCommand} from "../../../application/commands/confirm/confirm.command";

@ApiTags('User')
@Controller('api/users/confirm')
export class ConfirmAction {

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
        @Query(ValidationPipe)
        request: ConfirmRequest
    ): Promise<boolean> {

        try {
            await this.commandBus.execute(
                new ConfirmCommand(request.token)
            );

            return true;
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }
}
