import {PublishMessageInterface} from "./publish-message.interface";
import {Injectable} from "@nestjs/common";
import CentrifugeService from "../../../../centrifuge/services/centrifuge.service";
import {ChatUserRepository} from "../../../infrastructure/repositories/chat-user.repository";

@Injectable()
export class CentrifugoPublishMessage implements PublishMessageInterface {

    constructor(
        private readonly centrifugoService: CentrifugeService,
        private readonly chatUserRepository: ChatUserRepository,
    ) {}

    async publishToChat(chatId: string, event: string, data: any): Promise<void> {
        const emails = await this.chatUserRepository.getUsersEmail(chatId);
        for await (let email of emails) {
            await this.centrifugoService.publish(
                `chat-${email}#${email}`,
                {
                    event,
                    data
                }
            );
        }
    }

}