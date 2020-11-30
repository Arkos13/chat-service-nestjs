import {BadRequestException, Controller, Get, HttpCode, Query, UseGuards, ValidationPipe} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {QueryBus} from "@nestjs/cqrs";
import {PaginatedData} from "../../../../../infrastructure/value-object/paginated-data";
import {ChatDto} from "../../../application/queries/dto/chat.dto";
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {GetChatsByUserQuery} from "../../../application/queries/get-chats-by-user/get-chats-by-user.query";
import {GetUser} from "../../../../../infrastructure/decorators/get-user.decorator";
import {User} from "../../../../user/model/entities/user.entity";
import {GetChatsRequest} from "../requests/get-chats.request";

@ApiTags('Chat')
@Controller('api/chats')
@UseGuards(AuthGuard('jwt'))
export class GetChatsByUserAction {
    constructor(
        private readonly queryBus: QueryBus,
    ) {}

    @Get()
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        type: PaginatedData
    })
    @ApiBearerAuth()
    public async action(
        @Query(new ValidationPipe({transform: true})) request: GetChatsRequest,
        @GetUser() currentUser: User,
    ): Promise<PaginatedData<ChatDto>> {
        try {
          return await this.queryBus.execute(
              new GetChatsByUserQuery(currentUser.id, request.page, request.limit)
          );
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }
}
