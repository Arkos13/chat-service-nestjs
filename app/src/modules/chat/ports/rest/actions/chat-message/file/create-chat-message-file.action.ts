import {
    BadRequestException,
    Controller,
    HttpCode,
    Post,
    UploadedFile,
    UseGuards, UseInterceptors,
} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {CommandBus, QueryBus} from "@nestjs/cqrs";
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {v4 as uuidv4} from "uuid";
import {FileInterceptor} from "@nestjs/platform-express";
import {CreateFileCommand} from "../../../../../application/commands/chat-message/create-file/create-file.command";
import {GetFileByIdQuery} from "../../../../../application/queries/chat-message/get-file-by-id/get-file-by-id.query";
import {ChatMessageFileDto} from "../../../../../application/queries/dto/chat-message-file.dto";

@ApiTags('Chat (message)')
@Controller('api/chats/messages/files')
@UseGuards(AuthGuard('jwt'))
export class CreateChatMessageFileAction {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @Post()
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        type: ChatMessageFileDto
    })
    @ApiBearerAuth()
    @UseInterceptors(FileInterceptor('file'))
    public async action(@UploadedFile() file): Promise<boolean> {
        try {
            const id = uuidv4();
            await this.commandBus.execute(
                new CreateFileCommand(
                    id,
                    file.path,
                    file.mimetype,
                    file.originalname,
                    file.filename,
                    file.size
                )
            );

            return await this.queryBus.execute(new GetFileByIdQuery(id));
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }
}
