import {BadRequestException, Controller, Get, HttpCode, Param} from "@nestjs/common"
import {CommandBus, QueryBus} from "@nestjs/cqrs";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {GetInfoQuery} from "../../../application/queries/get-info/get-info.query";
import {UserInfoDto} from "../../../application/queries/get-info/user-info.dto";

@ApiTags('User')
@Controller('api/users/by_email/:email')
export class GetInfoAction {

    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @Get()
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        type: UserInfoDto
    })
    public async action(@Param() params): Promise<UserInfoDto> {

        try {
            return await this.queryBus.execute(
                new GetInfoQuery(params.email)
            );
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }
}
