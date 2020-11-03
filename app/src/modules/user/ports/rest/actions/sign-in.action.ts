import {Body, Controller, Post, ValidationPipe} from "@nestjs/common"
import {CommandBus, QueryBus} from "@nestjs/cqrs";
import {GetAccessTokenQuery} from "../../../application/queries/get-access-token/get-access-token.query";
import {SignInRequest} from "../requests/sign-in.request";
import {SignInCommand} from "../../../application/commands/sign-in/sign-in.command";

@Controller('api/auth')
export class SignInAction {

    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @Post('/token')
    public async getTokenAction(
        @Body(ValidationPipe)
        request: SignInRequest
    ): Promise<string> {

        await this.commandBus.execute(
            new SignInCommand(request.email, request.password)
        );

        return this.queryBus.execute(
            new GetAccessTokenQuery(request.email)
        );
    }
}
