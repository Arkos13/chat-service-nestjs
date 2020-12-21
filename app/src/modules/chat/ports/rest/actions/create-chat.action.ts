import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Inject,
    Logger,
    Post,
    UseGuards,
    ValidationPipe
} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {CommandBus, QueryBus} from "@nestjs/cqrs";
import {ChatRequest} from "../requests/chat.request";
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CreateChatCommand} from "../../../application/commands/create-chat/create-chat.command";
import {v4 as uuidv4} from "uuid";
import {GetChatQuery} from "../../../application/queries/get-chat/get-chat.query";
import {GetUser} from "../../../../../infrastructure/decorators/get-user.decorator";
import {User} from "../../../../user/model/entities/user.entity";
import {ChatDto} from "../../../application/queries/dto/chat.dto";
import {PublishMessageInterface} from "../../../application/services/publish-message/publish-message.interface";
import {CREATED_CHAT_EVENT} from "../../../application/services/publish-message/event-message";

@ApiTags('Chat')
@Controller('api/chats')
@UseGuards(AuthGuard('jwt'))
export class CreateChatAction {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        @Inject('PublishMessageInterface')
        private readonly publishMessage: PublishMessageInterface,
        private readonly logger: Logger,
    ) {}

    @Post()
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        type: ChatDto
    })
    @ApiBearerAuth()
    public async action(
        @Body(ValidationPipe) request: ChatRequest,
        @GetUser() currentUser: User,
    ): Promise<ChatDto> {
        try {
            const id = uuidv4();
            const userIds = Array.from(
                new Set([
                    ...request.userIds,
                    currentUser.id
                ])
            );
            await this.commandBus.execute(
                new CreateChatCommand(
                    id,
                    request.title,
                    userIds,
                )
            );

            const chat = await this.queryBus.execute(new GetChatQuery(userIds, currentUser.id));

            this.publishMessage.publishToChat(
                chat.id,
                CREATED_CHAT_EVENT,
                chat
            ).catch((err) => this.logger.log('warn', err));

            return chat;
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }
}
