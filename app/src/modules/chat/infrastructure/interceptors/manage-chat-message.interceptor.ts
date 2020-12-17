import {CallHandler, ExecutionContext, ForbiddenException, Injectable, NestInterceptor} from "@nestjs/common";
import {Observable} from "rxjs";
import {ChatMessageRepository} from "../repositories/chat-message.repository";

@Injectable()
export class ManageChatMessageInterceptor implements NestInterceptor {
    constructor(
        private readonly repository: ChatMessageRepository,
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        try {
            const request = context.switchToHttp().getRequest();
            const chatMessage = await this.repository.getOneByIdAndChatId(
                request.params.messageId,
                request.params.chatId
            );

            if (chatMessage.userId !== request.user.id) {
                throw new Error();
            }

            return next.handle();
        } catch (e) {
            throw new ForbiddenException();
        }
    }

}