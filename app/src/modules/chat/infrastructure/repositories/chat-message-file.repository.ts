import {ChatMessageFileRepositoryInterface} from "../../model/repositories/chat-message-file.repository.interface";
import {ChatMessageFile} from "../../model/entities/chat-message-file.entity";
import {Injectable} from "@nestjs/common";
import {EntityManager, Repository} from "typeorm";

@Injectable()
export class ChatMessageFileRepository implements ChatMessageFileRepositoryInterface {

    private repository: Repository<ChatMessageFile>;

    constructor(
        private readonly em: EntityManager,
    ) {
        this.repository = em.getRepository<ChatMessageFile>(ChatMessageFile);
    }

    getOneById(id: string): Promise<ChatMessageFile> {
        return this.repository.findOneOrFail(id);
    }

    getOneByIdWithoutMessage(id: string): Promise<ChatMessageFile> {
        return this.repository.findOneOrFail(id, {where: {chatMessageId: null}});
    }

    async save(file: ChatMessageFile): Promise<void> {
        await this.repository.save(file);
    }

    async remove(file: ChatMessageFile): Promise<void> {
        await this.repository.remove(file);
    }

    findAllByChatMessageId(chatMessageId: string): Promise<ChatMessageFile[]> {
        return this.repository.find({where: {chatMessageId}});
    }

}