import {Body, Controller, Post, ValidationPipe} from "@nestjs/common";
import {GetTokenRequest} from "../requests/get-token.request";
import {QueryBus} from "@nestjs/cqrs";
import {GetAccessTokenQuery} from "../../../application/queries/get-access-token/get-access-token.query";

@Controller('api/auth')
export class GetTokenAction {

    constructor(
        private readonly queryBus: QueryBus,
    ) {}

    @Post('/token')
    public getTokenAction(
        @Body(ValidationPipe)
        request: GetTokenRequest
    ): Promise<string> {
        return this.queryBus.execute(new GetAccessTokenQuery(request.email, request.password));
    }
}
