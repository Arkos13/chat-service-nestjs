import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {GetFileByIdQuery} from "./get-file-by-id.query";
import {ChatMessageFileRepository} from "../../../../infrastructure/repositories/chat-message-file.repository";
import {ChatMessageFileDto} from "../../dto/chat-message-file.dto";

@QueryHandler(GetFileByIdQuery)
export class GetFileByIdQueryHandler implements IQueryHandler<GetFileByIdQuery> {

    constructor(
        private readonly repository: ChatMessageFileRepository,
    ) {}

    async execute(query: GetFileByIdQuery): Promise<ChatMessageFileDto> {
        const file = await this.repository.getOneById(query.id);
        return new ChatMessageFileDto(file.id, file.path);
    }

}