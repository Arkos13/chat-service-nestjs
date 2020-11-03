import {BadRequestException, Body, Controller, HttpCode, Post, ValidationPipe} from "@nestjs/common"
import {CommandBus} from "@nestjs/cqrs";
import {SignUpRequest} from "../requests/sign-up.request";
import {SignUpCommand} from "../../../application/commands/sign-up/sign-up.command";
import {ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('Auth')
@Controller('api/auth')
export class SignUpAction {

    constructor(
        private readonly commandBus: CommandBus,
    ) {}

    @Post('/registration')
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        type: Boolean
    })
    public async action(
        @Body(ValidationPipe)
        request: SignUpRequest
    ): Promise<boolean> {

        try {
            await this.commandBus.execute(
                new SignUpCommand(
                    request.email,
                    request.password,
                    request.firstName,
                    request.lastName
                )
            );

            return true;
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }
}
