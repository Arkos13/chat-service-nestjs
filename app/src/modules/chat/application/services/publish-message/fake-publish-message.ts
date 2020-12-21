import {PublishMessageInterface} from "./publish-message.interface";
import {Injectable} from "@nestjs/common";

@Injectable()
export class FakePublishMessage implements PublishMessageInterface {
    publishToChat(chatId: string, event: string, data: any): Promise<void> {
        return Promise.resolve(undefined);
    }

}