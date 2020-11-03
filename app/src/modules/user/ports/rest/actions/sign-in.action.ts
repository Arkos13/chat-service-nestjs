import {BadRequestException, Body, Controller, HttpCode, Post, ValidationPipe} from "@nestjs/common"
import {CommandBus, QueryBus} from "@nestjs/cqrs";
import {GetAccessTokenQuery} from "../../../application/queries/get-access-token/get-access-token.query";
import {SignInRequest} from "../requests/sign-in.request";
import {SignInCommand} from "../../../application/commands/sign-in/sign-in.command";
import {ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('Auth')
@Controller('api/auth')
export class SignInAction {

    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @Post('/token')
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        type: String
    })
    public async action(
        @Body(ValidationPipe)
        request: SignInRequest
    ): Promise<string> {

        try {
            await this.commandBus.execute(
                new SignInCommand(request.email, request.password)
            );

            return this.queryBus.execute(
                new GetAccessTokenQuery(request.email)
            );
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }
}
