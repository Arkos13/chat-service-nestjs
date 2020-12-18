import {
    BadRequestException,
    Controller,
    Get,
    HttpCode, Param,
    Query,
    UseGuards,
    UseInterceptors,
    ValidationPipe
} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {QueryBus} from "@nestjs/cqrs";
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {ReadChatInterceptor} from "../../../../infrastructure/interceptors/read-chat.interceptor";
import {PaginatedData} from "../../../../../../infrastructure/value-object/paginated-data";
import {ChatMessageDto} from "../../../../application/queries/dto/chat-message.dto";
import {GetChatMessagesQuery} from "../../../../application/queries/chat-message/get-chat-messages/get-chat-messages.query";
import {GetChatMessagesRequest} from "../../requests/get-chat-messages.request";

@ApiTags('Chat (message)')
@Controller('api/chats/:id/messages')
@UseGuards(AuthGuard('jwt'))
export class GetChatMessagesAction {
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
    @UseInterceptors(ReadChatInterceptor)
    public async action(
        @Query(new ValidationPipe({transform: true})) request: GetChatMessagesRequest,
        @Param() params,
    ): Promise<PaginatedData<ChatMessageDto>> {
        try {
            return await this.queryBus.execute(
                new GetChatMessagesQuery(params.id, request.page, request.limit)
            );
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }
}
